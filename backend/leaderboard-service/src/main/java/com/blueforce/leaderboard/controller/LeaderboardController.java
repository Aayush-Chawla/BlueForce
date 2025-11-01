package com.blueforce.leaderboard.controller;

import com.blueforce.leaderboard.dto.LeaderboardResponse;
import com.blueforce.leaderboard.service.LeaderboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/leaderboard")
public class LeaderboardController {

    @Autowired
    private LeaderboardService leaderboardService;

    @GetMapping("")
    public ResponseEntity<?> getLeaderboard(
            @RequestParam(value = "type", required = false) String type,
            @RequestParam(value = "page", required = false) Integer page,
            @RequestParam(value = "limit", required = false) Integer limit
    ) {
        int p = page != null ? page : 0;
        int l = limit != null ? limit : 25;
        Page<?> result = leaderboardService.getLeaderboard(type, p, l);
        return ResponseEntity.ok(LeaderboardResponse.of(result.getContent(), result.getTotalElements(), p, l));
    }

    @PostMapping("/recompute")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> recompute() {
        // Placeholder: recomputation could be triggered via Kafka in real flow
        return ResponseEntity.ok(java.util.Map.of("success", true, "message", "Recompute triggered"));
    }
}
