package com.virtualdebugginglab.controller;

import com.virtualdebugginglab.dto.AiHintRequest;
import com.virtualdebugginglab.dto.AiHintResponse;
import com.virtualdebugginglab.service.AiDebugAssistantService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
public class AiDebugController {

    @Autowired
    private AiDebugAssistantService aiDebugAssistantService;

    @PostMapping("/hint")
    public ResponseEntity<AiHintResponse> getSocraticHint(@Valid @RequestBody AiHintRequest request) {
        AiHintResponse response = aiDebugAssistantService.generateSocraticHint(request);
        return ResponseEntity.ok(response);
    }
}
