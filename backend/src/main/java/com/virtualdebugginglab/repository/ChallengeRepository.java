package com.virtualdebugginglab.repository;

import com.virtualdebugginglab.model.DebugChallenge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChallengeRepository extends JpaRepository<DebugChallenge, Long>, JpaSpecificationExecutor<DebugChallenge> {
    List<DebugChallenge> findByLanguage(DebugChallenge.Language language);
    List<DebugChallenge> findByDifficulty(DebugChallenge.Difficulty difficulty);
    List<DebugChallenge> findByBugType(DebugChallenge.BugType bugType);
    List<DebugChallenge> findByLanguageAndDifficulty(DebugChallenge.Language language, DebugChallenge.Difficulty difficulty);
}
