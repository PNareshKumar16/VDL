package com.virtualdebugginglab.dto;

import com.virtualdebugginglab.model.DebugChallenge;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChallengeDto {
    private Long id;
    private String title;
    private String description;
    private DebugChallenge.Language language;
    private DebugChallenge.Difficulty difficulty;
    private DebugChallenge.BugType bugType;
    private String buggyCode;
    private String solutionCode; // Only populated for admins or null for student views
    private String expectedOutput;
    private String testCasesJson;
    private Integer pointsReward;
    private Boolean isSolved; // Computed per user
    private LocalDateTime createdAt;

    public static ChallengeDto fromEntity(DebugChallenge entity, boolean includeSolution, Boolean isSolved) {
        return ChallengeDto.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .description(entity.getDescription())
                .language(entity.getLanguage())
                .difficulty(entity.getDifficulty())
                .bugType(entity.getBugType())
                .buggyCode(entity.getBuggyCode())
                .solutionCode(includeSolution ? entity.getSolutionCode() : null)
                .expectedOutput(entity.getExpectedOutput())
                .testCasesJson(entity.getTestCasesJson())
                .pointsReward(entity.getPointsReward())
                .isSolved(isSolved != null ? isSolved : false)
                .createdAt(entity.getCreatedAt())
                .build();
    }
}
