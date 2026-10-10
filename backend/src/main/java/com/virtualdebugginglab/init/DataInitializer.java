package com.virtualdebugginglab.init;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.virtualdebugginglab.model.DebugChallenge;
import com.virtualdebugginglab.model.User;
import com.virtualdebugginglab.repository.ChallengeRepository;
import com.virtualdebugginglab.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ChallengeRepository challengeRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void run(String... args) throws Exception {
        seedUsers();
        seedChallenges();
    }

    private void seedUsers() {
        if (userRepository.count() == 0) {
            log.info("Seeding initial users (student, admin)...");

            User student = User.builder()
                    .username("student")
                    .email("student@lab.edu")
                    .passwordHash(passwordEncoder.encode("password123"))
                    .role(User.Role.STUDENT)
                    .points(50)
                    .build();

            User admin = User.builder()
                    .username("admin")
                    .email("admin@lab.edu")
                    .passwordHash(passwordEncoder.encode("admin123"))
                    .role(User.Role.ADMIN)
                    .points(500)
                    .build();

            userRepository.saveAll(List.of(student, admin));
            log.info("Users seeded successfully.");
        }
    }

    private void seedChallenges() throws Exception {
        if (challengeRepository.count() == 0) {
            log.info("Seeding initial debug challenges...");

            // Challenge 1: Java NullPointer & Off-by-One
            String testCases1 = objectMapper.writeValueAsString(List.of(
                    Map.of("name", "Standard Array Sum", "input", "[10, 20, 30, 40, 50]", "expectedOutput", "Total Sum: 150"),
                    Map.of("name", "Single Element Array", "input", "[42]", "expectedOutput", "Total Sum: 42"),
                    Map.of("name", "Null Array Guard Test", "input", "null", "expectedOutput", "Total Sum: 0")
            ));

            DebugChallenge c1 = DebugChallenge.builder()
                    .title("Array Boundary & Null Pointer Traps")
                    .description("The `sumArray` method is designed to sum all integers in an array. However, students reported crashes in production with `ArrayIndexOutOfBoundsException` when summing arrays, and `NullPointerException` when passed null inputs. Fix the boundary condition and add defensive null handling.")
                    .language(DebugChallenge.Language.JAVA)
                    .difficulty(DebugChallenge.Difficulty.EASY)
                    .bugType(DebugChallenge.BugType.OFF_BY_ONE)
                    .buggyCode(
                        "public class DataProcessor {\n" +
                        "    public static String sumArray(int[] numbers) {\n" +
                        "        int total = 0;\n" +
                        "        // BUG 1: Off-by-One error (i <= numbers.length)\n" +
                        "        // BUG 2: Missing null reference check\n" +
                        "        for (int i = 0; i <= numbers.length; i++) {\n" +
                        "            total += numbers[i];\n" +
                        "        }\n" +
                        "        return \"Total Sum: \" + total;\n" +
                        "    }\n" +
                        "}"
                    )
                    .solutionCode(
                        "public class DataProcessor {\n" +
                        "    public static String sumArray(int[] numbers) {\n" +
                        "        if (numbers == null) {\n" +
                        "            return \"Total Sum: 0\";\n" +
                        "        }\n" +
                        "        int total = 0;\n" +
                        "        for (int i = 0; i < numbers.length; i++) {\n" +
                        "            total += numbers[i];\n" +
                        "        }\n" +
                        "        return \"Total Sum: \" + total;\n" +
                        "    }\n" +
                        "}"
                    )
                    .expectedOutput("Total Sum: 150")
                    .testCasesJson(testCases1)
                    .pointsReward(50)
                    .build();

            // Challenge 2: Java Concurrency Race Condition
            String testCases2 = objectMapper.writeValueAsString(List.of(
                    Map.of("name", "High Concurrency Thread Stress Test", "input", "20 Threads x 1,000 Ops", "expectedOutput", "Final Counter Value: 20000"),
                    Map.of("name", "Thread Safety Verification", "input", "Thread Join Validation", "expectedOutput", "Final Counter Value: 20000")
            ));

            DebugChallenge c2 = DebugChallenge.builder()
                    .title("Multi-Threaded Counter Race Condition")
                    .description("A web application tracks concurrent visitor hits using a shared counter across multiple worker threads. Under high traffic, the counter consistently reports fewer hits than total executed operations. Identify the race condition in the unsynchronized increment and make it thread-safe.")
                    .language(DebugChallenge.Language.JAVA)
                    .difficulty(DebugChallenge.Difficulty.MEDIUM)
                    .bugType(DebugChallenge.BugType.CONCURRENCY)
                    .buggyCode(
                        "import java.util.concurrent.ExecutorService;\n" +
                        "import java.util.concurrent.Executors;\n\n" +
                        "public class VisitorTracker {\n" +
                        "    // BUG: Unsynchronized primitive integer subject to thread race condition\n" +
                        "    private int counter = 0;\n\n" +
                        "    public void increment() {\n" +
                        "        counter++; // Non-atomic read-modify-write operation\n" +
                        "    }\n\n" +
                        "    public int getCounter() {\n" +
                        "        return counter;\n" +
                        "    }\n" +
                        "}"
                    )
                    .solutionCode(
                        "import java.util.concurrent.atomic.AtomicInteger;\n\n" +
                        "public class VisitorTracker {\n" +
                        "    private final AtomicInteger counter = new AtomicInteger(0);\n\n" +
                        "    public void increment() {\n" +
                        "        counter.incrementAndGet();\n" +
                        "    }\n\n" +
                        "    public int getCounter() {\n" +
                        "        return counter.get();\n" +
                        "    }\n" +
                        "}"
                    )
                    .expectedOutput("Final Counter Value: 20000")
                    .testCasesJson(testCases2)
                    .pointsReward(100)
                    .build();

            // Challenge 3: Java/C Logic Bug (Broken Binary Search Overflow)
            String testCases3 = objectMapper.writeValueAsString(List.of(
                    Map.of("name", "Standard Array Search", "input", "arr=[2, 5, 8, 12, 16, 23, 38, 56, 72, 91], target=23", "expectedOutput", "Target found at index: 5"),
                    Map.of("name", "Boundary Element Search", "input", "arr=[1, 3, 5], target=5", "expectedOutput", "Target found at index: 2"),
                    Map.of("name", "Large Array Overflow Check", "input", "Large Array Size=1,500,000,000", "expectedOutput", "Target found at index: 1499999999")
            ));

            DebugChallenge c3 = DebugChallenge.builder()
                    .title("Binary Search Integer Overflow & Logic Trap")
                    .description("This binary search algorithm fails on large arrays with an `ArrayIndexOutOfBoundsException` because `(low + high) / 2` overflows 32-bit signed integers. Furthermore, the search loop fails to inspect the final single-element range due to an incorrect loop condition.")
                    .language(DebugChallenge.Language.JAVA)
                    .difficulty(DebugChallenge.Difficulty.HARD)
                    .bugType(DebugChallenge.BugType.LOGICAL)
                    .buggyCode(
                        "public class SearchUtils {\n" +
                        "    public static int binarySearch(int[] arr, int target) {\n" +
                        "        int low = 0;\n" +
                        "        int high = arr.length - 1;\n\n" +
                        "        // BUG 1: Loop condition 'low < high' misses the high index boundary element\n" +
                        "        while (low < high) {\n" +
                        "            // BUG 2: (low + high) causes 32-bit signed integer overflow when high > 1 Billion\n" +
                        "            int mid = (low + high) / 2;\n\n" +
                        "            if (arr[mid] == target) {\n" +
                        "                return mid;\n" +
                        "            } else if (arr[mid] < target) {\n" +
                        "                low = mid + 1;\n" +
                        "            } else {\n" +
                        "                high = mid - 1;\n" +
                        "            }\n" +
                        "        }\n" +
                        "        return -1;\n" +
                        "    }\n" +
                        "}"
                    )
                    .solutionCode(
                        "public class SearchUtils {\n" +
                        "    public static int binarySearch(int[] arr, int target) {\n" +
                        "        int low = 0;\n" +
                        "        int high = arr.length - 1;\n\n" +
                        "        while (low <= high) {\n" +
                        "            int mid = low + (high - low) / 2;\n\n" +
                        "            if (arr[mid] == target) {\n" +
                        "                return mid;\n" +
                        "            } else if (arr[mid] < target) {\n" +
                        "                low = mid + 1;\n" +
                        "            } else {\n" +
                        "                high = mid - 1;\n" +
                        "            }\n" +
                        "        }\n" +
                        "        return -1;\n" +
                        "    }\n" +
                        "}"
                    )
                    .expectedOutput("Target found at index: 5")
                    .testCasesJson(testCases3)
                    .pointsReward(150)
                    .build();

            challengeRepository.saveAll(List.of(c1, c2, c3));
            log.info("Challenges seeded successfully.");
        }
    }
}
