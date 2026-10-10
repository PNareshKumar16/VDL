package com.virtualdebugginglab.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "debug_challenges")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DebugChallenge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Language language;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Difficulty difficulty;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private BugType bugType;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String buggyCode;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String solutionCode;

    @Column(columnDefinition = "TEXT")
    private String expectedOutput;

    @Column(columnDefinition = "TEXT")
    private String testCasesJson;

    @Column(nullable = false)
    @Builder.Default
    private Integer pointsReward = 100;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.pointsReward == null) {
            this.pointsReward = difficulty == Difficulty.EASY ? 50 : (difficulty == Difficulty.HARD ? 150 : 100);
        }
    }

    public enum Language {
        JAVA,
        C,
        PYTHON
    }

    public enum Difficulty {
        EASY,
        MEDIUM,
        HARD
    }

    public enum BugType {
        LOGICAL,
        CONCURRENCY,
        RUNTIME,
        SYNTAX,
        MEMORY_LEAK,
        NULL_REFERENCE,
        OFF_BY_ONE
    }
}
