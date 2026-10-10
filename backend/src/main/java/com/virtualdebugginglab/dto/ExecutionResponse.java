package com.virtualdebugginglab.dto;

import com.virtualdebugginglab.model.Submission;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExecutionResponse {
    private Submission.Status status;
    private String consoleOutput;
    private Long executionTimeMs;
    private Integer testCasesTotal;
    private Integer testCasesPassed;
    private List<TestCaseResult> testCaseResults;
    private Integer pointsEarned;
    private Integer totalUserPoints;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class TestCaseResult {
        private String name;
        private String input;
        private String expectedOutput;
        private String actualOutput;
        private boolean passed;
        private String errorMessage;
    }
}
