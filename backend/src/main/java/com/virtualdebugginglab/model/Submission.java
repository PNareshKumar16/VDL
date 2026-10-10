package com.virtualdebugginglab.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "submissions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Submission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "challenge_id", nullable = false)
    private DebugChallenge challenge;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String submittedCode;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 25)
    private Status status;

    @Column(columnDefinition = "TEXT")
    private String consoleOutput;

    @Column(nullable = false)
    @Builder.Default
    private Integer hintsUsedCount = 0;

    @Column(nullable = false)
    @Builder.Default
    private Long executionTimeMs = 0L;

    @Column(nullable = false, updatable = false)
    private LocalDateTime submittedAt;

    @PrePersist
    protected void onCreate() {
        this.submittedAt = LocalDateTime.now();
        if (this.hintsUsedCount == null) {
            this.hintsUsedCount = 0;
        }
        if (this.executionTimeMs == null) {
            this.executionTimeMs = 0L;
        }
    }

    public enum Status {
        PASSED,
        FAILED,
        RUNTIME_ERROR,
        COMPILATION_ERROR
    }
}
