package com.virtualdebugginglab.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.virtualdebugginglab.dto.AiHintRequest;
import com.virtualdebugginglab.dto.AiHintResponse;
import com.virtualdebugginglab.model.DebugChallenge;
import com.virtualdebugginglab.repository.ChallengeRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class AiDebugAssistantService {

    private static final Logger log = LoggerFactory.getLogger(AiDebugAssistantService.class);

    @Value("${app.ai.api-key:}")
    private String aiApiKey;

    @Autowired
    private ChallengeRepository challengeRepository;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public AiHintResponse generateSocraticHint(AiHintRequest request) {
        DebugChallenge challenge = challengeRepository.findById(request.getChallengeId())
                .orElseThrow(() -> new IllegalArgumentException("Challenge not found with id: " + request.getChallengeId()));

        int level = request.getHintLevel() != null ? request.getHintLevel() : 1;

        // Try Gemini API if key exists
        if (aiApiKey != null && !aiApiKey.trim().isEmpty() && !aiApiKey.equals("YOUR_GEMINI_API_KEY")) {
            try {
                return callGeminiSocraticApi(challenge, request.getCurrentCode(), request.getErrorMessage(), level);
            } catch (Exception e) {
                log.warn("Gemini API call failed, falling back to built-in Socratic mentor: {}", e.getMessage());
            }
        }

        // Default Socratic Pedagogical Fallback Engine
        return generateFallbackSocraticHint(challenge, request.getCurrentCode(), request.getErrorMessage(), level);
    }

    private AiHintResponse callGeminiSocraticApi(DebugChallenge challenge, String currentCode, String errorMessage, int level) throws Exception {
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + aiApiKey;

        String systemPrompt = buildSocraticPrompt(challenge, currentCode, errorMessage, level);

        Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(
                                Map.of("text", systemPrompt)
                        ))
                )
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
        ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);

        if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
            JsonNode root = objectMapper.readTree(response.getBody());
            String text = root.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText();
            
            return parseAiResponseText(text, level);
        }

        throw new RuntimeException("Gemini API returned status: " + response.getStatusCode());
    }

    private String buildSocraticPrompt(DebugChallenge challenge, String currentCode, String errorMessage, int level) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("You are an expert Socratic Debugging Mentor for computer science students.\n");
        prompt.append("Challenge Title: ").append(challenge.getTitle()).append("\n");
        prompt.append("Programming Language: ").append(challenge.getLanguage()).append("\n");
        prompt.append("Bug Domain: ").append(challenge.getBugType()).append("\n");
        prompt.append("Error Log: ").append(errorMessage != null ? errorMessage : "None").append("\n");
        prompt.append("Student Current Code:\n```\n").append(currentCode).append("\n```\n\n");

        prompt.append("INSTRUCTIONS FOR HINT LEVEL ").append(level).append(":\n");
        if (level == 1) {
            prompt.append("Provide a Level 1 (Nudge): Point to the line or general logic section where the bug resides without providing any code or technical solution. Ask a guiding question to lead the student's attention.\n");
        } else if (level == 2) {
            prompt.append("Provide a Level 2 (Diagnostic): Explains *why* the failure or exception occurs conceptually (e.g. race conditions, off-by-one boundary, null pointer dereference). Do NOT give the fixed code.\n");
        } else {
            prompt.append("Provide a Level 3 (Actionable): Suggest a specific code pattern or conditional guard syntax to resolve the bug, without giving the entire solved program.\n");
        }

        prompt.append("\nReturn JSON format exactly like this:\n");
        prompt.append("{\n");
        prompt.append("  \"title\": \"Brief Hint Headline\",\n");
        prompt.append("  \"hintText\": \"Detailed Socratic hint text\",\n");
        prompt.append("  \"pedagogicalGoal\": \"Learning goal of this hint\",\n");
        prompt.append("  \"codeSnippet\": \"Guard pattern or snippet if level 3 else null\"\n");
        prompt.append("}");

        return prompt.toString();
    }

    private AiHintResponse parseAiResponseText(String text, int level) {
        try {
            int jsonStart = text.indexOf("{");
            int jsonEnd = text.lastIndexOf("}");
            if (jsonStart != -1 && jsonEnd != -1) {
                String jsonStr = text.substring(jsonStart, jsonEnd + 1);
                JsonNode node = objectMapper.readTree(jsonStr);
                return AiHintResponse.builder()
                        .hintLevel(level)
                        .hintLevelName(level == 1 ? "Level 1 (Nudge)" : (level == 2 ? "Level 2 (Diagnostic)" : "Level 3 (Actionable)"))
                        .title(node.path("title").asText("Socratic Debugging Insight"))
                        .hintText(node.path("hintText").asText(text))
                        .pedagogicalGoal(node.path("pedagogicalGoal").asText("Understand error context"))
                        .codeSnippet(node.has("codeSnippet") && !node.path("codeSnippet").isNull() ? node.path("codeSnippet").asText() : null)
                        .pointsDeducted(level == 1 ? 0 : (level == 2 ? 5 : 10))
                        .build();
            }
        } catch (Exception e) {
            log.warn("Could not parse AI response as JSON: {}", e.getMessage());
        }

        return AiHintResponse.builder()
                .hintLevel(level)
                .hintLevelName(level == 1 ? "Level 1 (Nudge)" : (level == 2 ? "Level 2 (Diagnostic)" : "Level 3 (Actionable)"))
                .title("Socratic Guidance")
                .hintText(text)
                .pedagogicalGoal("Guide student toward root cause analysis")
                .pointsDeducted(level == 1 ? 0 : (level == 2 ? 5 : 10))
                .build();
    }

    private AiHintResponse generateFallbackSocraticHint(DebugChallenge challenge, String currentCode, String errorMessage, int level) {
        String levelName = level == 1 ? "Level 1 (Nudge)" : (level == 2 ? "Level 2 (Diagnostic)" : "Level 3 (Actionable)");
        int points = level == 1 ? 0 : (level == 2 ? 5 : 10);

        if (challenge.getId() == 1) { // Java - NullPointer & Off-by-One
            if (level == 1) {
                return AiHintResponse.builder()
                        .hintLevel(1)
                        .hintLevelName(levelName)
                        .title("Inspect Array Boundaries & Input Nullability")
                        .hintText("Look closely at the `for` loop termination condition: `i <= numbers.length`. In Java, if an array has 5 elements, what is the valid index range? Also, what happens if `numbers` itself is passed as `null`?")
                        .pedagogicalGoal("Identify boundary limits in 0-indexed data structures.")
                        .pointsDeducted(points)
                        .build();
            } else if (level == 2) {
                return AiHintResponse.builder()
                        .hintLevel(2)
                        .hintLevelName(levelName)
                        .title("Understanding ArrayIndexOutOfBounds & Null Pointer Exceptions")
                        .hintText("An `ArrayIndexOutOfBoundsException` occurs because Java arrays are 0-indexed (indices range from `0` to `length - 1`). Using `<= length` attempts to read memory beyond the array's allocated memory space. Additionally, calling `.length` on a `null` object reference triggers a `NullPointerException` before loop execution even begins.")
                        .pedagogicalGoal("Master memory boundaries and defensive null validation in Java.")
                        .pointsDeducted(points)
                        .build();
            } else {
                return AiHintResponse.builder()
                        .hintLevel(3)
                        .hintLevelName(levelName)
                        .title("Guard Pattern & Loop Upper Bound Fix")
                        .hintText("Add an initial null check at the start of your method, and update the loop condition to use strictly `< numbers.length`.")
                        .pedagogicalGoal("Implement defensive guards for null and array bounds.")
                        .codeSnippet("if (numbers == null) return 0;\nfor (int i = 0; i < numbers.length; i++) {\n    // process element\n}")
                        .pointsDeducted(points)
                        .build();
            }
        } else if (challenge.getId() == 2) { // Concurrency Glitch
            if (level == 1) {
                return AiHintResponse.builder()
                        .hintLevel(1)
                        .hintLevelName(levelName)
                        .title("Observe Thread Interleaving & Shared Mutation")
                        .hintText("Multiple worker threads are invoking `counter++` concurrently. Is the `counter++` operation atomic in Java bytecode, or does it consist of multiple CPU instructions?")
                        .pedagogicalGoal("Recognize non-atomic operations in multithreaded environments.")
                        .pointsDeducted(points)
                        .build();
            } else if (level == 2) {
                return AiHintResponse.builder()
                        .hintLevel(2)
                        .hintLevelName(levelName)
                        .title("Concept of Race Conditions & Cache Visibility")
                        .hintText("In Java, `counter++` reads the current value into a CPU register, increments it, and writes it back. When two threads execute this simultaneously, both read value 10 and both write back 11, losing one increment operation (a classic Race Condition).")
                        .pedagogicalGoal("Understand lost updates and hardware thread execution interference.")
                        .pointsDeducted(points)
                        .build();
            } else {
                return AiHintResponse.builder()
                        .hintLevel(3)
                        .hintLevelName(levelName)
                        .title("Thread Synchronization & Atomic Primitive Pattern")
                        .hintText("Replace the raw `int` counter with `AtomicInteger` and use `.incrementAndGet()`, or synchronize the counter modification block.")
                        .pedagogicalGoal("Apply lock-free atomic concurrency primitives in Java.")
                        .codeSnippet("private final AtomicInteger counter = new AtomicInteger(0);\n\npublic void increment() {\n    counter.incrementAndGet();\n}")
                        .pointsDeducted(points)
                        .build();
            }
        } else if (challenge.getId() == 3) { // Broken Binary Search
            if (level == 1) {
                return AiHintResponse.builder()
                        .hintLevel(1)
                        .hintLevelName(levelName)
                        .title("Check Integer Arithmetic & Loop Condition")
                        .hintText("Examine `int mid = (low + high) / 2`. What happens to 32-bit signed integers when `low` and `high` are very large (e.g., near 2 Billion)? Also verify if `low < high` checks the final single-element range.")
                        .pedagogicalGoal("Identify integer overflow and search space termination conditions.")
                        .pointsDeducted(points)
                        .build();
            } else if (level == 2) {
                return AiHintResponse.builder()
                        .hintLevel(2)
                        .hintLevelName(levelName)
                        .title("Integer Overflow in Midpoint Calculation")
                        .hintText("In Java, adding two large positive integers exceeding `Integer.MAX_VALUE` (2,147,483,647) wraps around into negative numbers due to two's-complement arithmetic, leading to a negative array index.")
                        .pedagogicalGoal("Grasp numeric overflow limits in binary search algorithms.")
                        .pointsDeducted(points)
                        .build();
            } else {
                return AiHintResponse.builder()
                        .hintLevel(3)
                        .hintLevelName(levelName)
                        .title("Overflow-Safe Midpoint & Termination Guard")
                        .hintText("Calculate the midpoint using `low + (high - low) / 2` and ensure loop condition uses `low <= high`.")
                        .pedagogicalGoal("Write robust binary search logic.")
                        .codeSnippet("while (low <= high) {\n    int mid = low + (high - low) / 2;\n    // search logic\n}")
                        .pointsDeducted(points)
                        .build();
            }
        }

        // Generic fallback
        return AiHintResponse.builder()
                .hintLevel(level)
                .hintLevelName(levelName)
                .title("Socratic Debugging Guidance")
                .hintText(level == 1 
                        ? "Review the error message stack trace and trace variable mutations manually step-by-step."
                        : (level == 2 
                            ? "Analyze the contract expectations of your data structures and language runtime rules."
                            : "Add defensive validation checks or explicit boundary conditions prior to variable dereferencing."))
                .pedagogicalGoal("Promote systematic debugging methodology.")
                .pointsDeducted(points)
                .build();
    }
}
