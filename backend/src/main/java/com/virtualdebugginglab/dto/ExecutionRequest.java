package com.virtualdebugginglab.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExecutionRequest {
    @NotNull
    private Long challengeId;

    @NotBlank
    private String code;

    private Integer hintsUsedCount = 0;
}
