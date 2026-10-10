package com.virtualdebugginglab.service;

import com.virtualdebugginglab.dto.ChallengeDto;
import com.virtualdebugginglab.model.DebugChallenge;
import com.virtualdebugginglab.model.Submission;
import com.virtualdebugginglab.model.User;
import com.virtualdebugginglab.repository.ChallengeRepository;
import com.virtualdebugginglab.repository.SubmissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChallengeService {

    @Autowired
    private ChallengeRepository challengeRepository;

    @Autowired
    private SubmissionRepository submissionRepository;

    public List<ChallengeDto> getChallenges(DebugChallenge.Language language,
                                           DebugChallenge.Difficulty difficulty,
                                           DebugChallenge.BugType bugType,
                                           User currentUser) {
        List<DebugChallenge> challenges = challengeRepository.findAll();

        return challenges.stream()
                .filter(c -> language == null || c.getLanguage() == language)
                .filter(c -> difficulty == null || c.getDifficulty() == difficulty)
                .filter(c -> bugType == null || c.getBugType() == bugType)
                .map(c -> {
                    boolean isSolved = false;
                    if (currentUser != null) {
                        isSolved = submissionRepository.existsByUserIdAndChallengeIdAndStatus(
                                currentUser.getId(), c.getId(), Submission.Status.PASSED);
                    }
                    // Exclude solutionCode for challenge listings
                    return ChallengeDto.fromEntity(c, currentUser != null && currentUser.getRole() == User.Role.ADMIN, isSolved);
                })
                .collect(Collectors.toList());
    }

    public ChallengeDto getChallengeById(Long id, User currentUser) {
        DebugChallenge challenge = challengeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Challenge not found with id: " + id));

        boolean isSolved = false;
        boolean isAdmin = currentUser != null && currentUser.getRole() == User.Role.ADMIN;
        
        if (currentUser != null) {
            isSolved = submissionRepository.existsByUserIdAndChallengeIdAndStatus(
                    currentUser.getId(), id, Submission.Status.PASSED);
        }

        // Students never see solutionCode (requirement 2.D.2)
        return ChallengeDto.fromEntity(challenge, isAdmin, isSolved);
    }

    public ChallengeDto createChallenge(DebugChallenge challenge) {
        DebugChallenge saved = challengeRepository.save(challenge);
        return ChallengeDto.fromEntity(saved, true, false);
    }
}
