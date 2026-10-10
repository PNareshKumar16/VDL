package com.virtualdebugginglab.controller;

import com.virtualdebugginglab.dto.ExecutionRequest;
import com.virtualdebugginglab.dto.ExecutionResponse;
import com.virtualdebugginglab.model.Submission;
import com.virtualdebugginglab.model.User;
import com.virtualdebugginglab.repository.SubmissionRepository;
import com.virtualdebugginglab.service.ExecutionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/submissions")
public class SubmissionController {

    @Autowired
    private ExecutionService executionService;

    @Autowired
    private SubmissionRepository submissionRepository;

    @PostMapping("/run")
    public ResponseEntity<ExecutionResponse> runCode(
            @Valid @RequestBody ExecutionRequest request,
            @AuthenticationPrincipal User currentUser) {
        ExecutionResponse response = executionService.runCode(request, currentUser);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/submit")
    public ResponseEntity<ExecutionResponse> submitCode(
            @Valid @RequestBody ExecutionRequest request,
            @AuthenticationPrincipal User currentUser) {
        ExecutionResponse response = executionService.submitCode(request, currentUser);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/user")
    public ResponseEntity<List<Submission>> getUserSubmissions(@AuthenticationPrincipal User currentUser) {
        if (currentUser == null) {
            return ResponseEntity.status(401).build();
        }
        List<Submission> submissions = submissionRepository.findByUserIdOrderBySubmittedAtDesc(currentUser.getId());
        return ResponseEntity.ok(submissions);
    }

    @GetMapping("/challenge/{challengeId}")
    public ResponseEntity<List<Submission>> getUserSubmissionsForChallenge(
            @PathVariable Long challengeId,
            @AuthenticationPrincipal User currentUser) {
        if (currentUser == null) {
            return ResponseEntity.status(401).build();
        }
        List<Submission> submissions = submissionRepository.findByUserIdAndChallengeIdOrderBySubmittedAtDesc(currentUser.getId(), challengeId);
        return ResponseEntity.ok(submissions);
    }
}
