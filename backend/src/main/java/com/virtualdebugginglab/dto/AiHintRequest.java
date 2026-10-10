package com.virtualdebugginglab.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AiHintRequest {
    @NotNull
    private Long challengeId;

    @NotBlank
    private String currentCode;

    @NotNull
    private Integer hintLevel; // 1 (Nudge), 2 (Diagnostic), 3 (Actionable)

    private String errorMessage;
    private String failedTestCaseInput;
}
