package com.blueforce.feedback.controller;

import com.blueforce.feedback.model.Feedback;
import com.blueforce.feedback.repository.FeedbackRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/feedback")
@RequiredArgsConstructor
public class FeedbackController {

    private final FeedbackRepository repository;

    @PostMapping("")
    @PreAuthorize("hasRole('PARTICIPANT')")
    public ResponseEntity<?> submit(@AuthenticationPrincipal Jwt jwt, @RequestBody Map<String, Object> body) {
        Long userId = Long.parseLong(jwt.getClaimAsString("user_id") != null ? jwt.getClaimAsString("user_id") : jwt.getSubject());
        Long eventId = Long.parseLong(String.valueOf(body.get("eventId")));
        Integer rating = Integer.parseInt(String.valueOf(body.get("rating")));
        String content = String.valueOf(body.getOrDefault("feedback", ""));
        Feedback saved = repository.save(Feedback.builder()
                .eventId(eventId)
                .userId(userId)
                .rating(rating)
                .content(content)
                .createdAt(LocalDateTime.now())
                .build());
        return ResponseEntity.ok(Map.of("success", true, "message", "Submitted", "data", Map.of("id", saved.getId())));
    }

    @GetMapping("")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> list(@RequestParam(value = "eventId", required = false) Long eventId,
                                  @RequestParam(value = "page", required = false) Integer page,
                                  @RequestParam(value = "limit", required = false) Integer limit) {
        int p = page != null ? page : 0; int l = limit != null ? limit : 25;
        Page<Feedback> result = (eventId == null)
                ? repository.findAll(PageRequest.of(p, l))
                : repository.findByEventIdOrderByCreatedAtDesc(eventId, PageRequest.of(p, l));
        return ResponseEntity.ok(Map.of("success", true, "message", "OK", "data", Map.of(
                "items", result.getContent(), "total", result.getTotalElements(), "page", p, "limit", l
        )));
    }
}




