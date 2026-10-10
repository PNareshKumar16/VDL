package com.virtualdebugginglab.controller;

import com.virtualdebugginglab.dto.ChallengeDto;
import com.virtualdebugginglab.model.DebugChallenge;
import com.virtualdebugginglab.model.User;
import com.virtualdebugginglab.service.ChallengeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/challenges")
public class ChallengeController {

    @Autowired
    private ChallengeService challengeService;

    @GetMapping
    public ResponseEntity<List<ChallengeDto>> getChallenges(
            @RequestParam(required = false) DebugChallenge.Language language,
            @RequestParam(required = false) DebugChallenge.Difficulty difficulty,
            @RequestParam(required = false) DebugChallenge.BugType bugType,
            @AuthenticationPrincipal User currentUser) {
        List<ChallengeDto> challenges = challengeService.getChallenges(language, difficulty, bugType, currentUser);
        return ResponseEntity.ok(challenges);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ChallengeDto> getChallengeById(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser) {
        ChallengeDto challenge = challengeService.getChallengeById(id, currentUser);
        return ResponseEntity.ok(challenge);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ChallengeDto> createChallenge(@RequestBody DebugChallenge challenge) {
        ChallengeDto created = challengeService.createChallenge(challenge);
        return ResponseEntity.ok(created);
    }
}
