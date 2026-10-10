package com.virtualdebugginglab.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiHintResponse {
    private Integer hintLevel;
    private String hintLevelName; // "Nudge", "Diagnostic", "Actionable"
    private String title;
    private String hintText;
    private String pedagogicalGoal;
    private Integer pointsDeducted;
    private String codeSnippet; // Suggested guard condition or pattern (for Level 3)
}
