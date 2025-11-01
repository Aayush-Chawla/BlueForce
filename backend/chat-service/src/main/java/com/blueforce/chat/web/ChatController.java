package com.blueforce.chat.web;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.*;
import java.util.concurrent.CopyOnWriteArrayList;

@RestController
@RequestMapping("/api/chat")
public class ChatController {
    private final List<Map<String, Object>> messages = new CopyOnWriteArrayList<>();

    @GetMapping("/health")
    public Map<String, Object> health() {
        return Map.of("status", "OK", "timestamp", Instant.now().toString());
    }

    @GetMapping("/messages")
    public Map<String, Object> list() {
        return Map.of("data", Map.of("items", messages));
    }

    @PostMapping("/messages")
    public ResponseEntity<Map<String, Object>> send(@RequestBody Map<String, Object> payload) {
        Map<String, Object> msg = new HashMap<>();
        msg.put("id", UUID.randomUUID().toString());
        msg.put("sender", String.valueOf(payload.getOrDefault("sender", "user")));
        msg.put("text", String.valueOf(payload.getOrDefault("text", "")));
        msg.put("timestamp", Instant.now().toString());
        messages.add(msg);
        return ResponseEntity.ok(Map.of("data", msg));
    }
}




