package com.blueforce.chat.web;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*")
public class ChatController {
    // Store messages by conversation ID
    private final Map<String, List<Map<String, Object>>> conversations = new ConcurrentHashMap<>();
    
    // Store conversation metadata: conversationId -> {ngoId, participantId, lastMessageTime}
    private final Map<String, Map<String, Object>> conversationMetadata = new ConcurrentHashMap<>();

    @GetMapping("/health")
    public Map<String, Object> health() {
        return Map.of("status", "OK", "timestamp", Instant.now().toString());
    }

    /**
     * Get all conversations for a user (NGO or Participant)
     */
    @GetMapping("/conversations")
    public ResponseEntity<Map<String, Object>> getConversations(
            @RequestParam("userId") Long userId) {
        List<Map<String, Object>> userConversations = conversationMetadata.values().stream()
                .filter(meta -> {
                    Long ngoId = getLongValue(meta, "ngoId");
                    Long participantId = getLongValue(meta, "participantId");
                    return (ngoId != null && ngoId.equals(userId)) || 
                           (participantId != null && participantId.equals(userId));
                })
                .sorted((a, b) -> {
                    Instant timeA = parseInstant(getStringValue(a, "lastMessageTime"));
                    Instant timeB = parseInstant(getStringValue(b, "lastMessageTime"));
                    return timeB.compareTo(timeA); // Most recent first
                })
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(Map.of("data", Map.of("items", userConversations)));
    }

    /**
     * Get messages for a specific conversation
     */
    @GetMapping("/conversations/{conversationId}/messages")
    public ResponseEntity<Map<String, Object>> getMessages(
            @PathVariable String conversationId) {
        List<Map<String, Object>> messages = conversations.getOrDefault(conversationId, new ArrayList<>());
        return ResponseEntity.ok(Map.of("data", Map.of("items", messages)));
    }

    /**
     * Send a message in a conversation
     */
    @PostMapping("/messages")
    public ResponseEntity<Map<String, Object>> sendMessage(@RequestBody Map<String, Object> payload) {
        Long senderId = getLongValue(payload, "senderId");
        Long receiverId = getLongValue(payload, "receiverId");
        String text = String.valueOf(payload.getOrDefault("text", ""));
        
        if (senderId == null || text == null || text.trim().isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Missing required fields: senderId, text"));
        }

        // Determine conversation ID based on sender and receiver
        // For NGO-Participant conversations, we need to identify which is which
        Long ngoId = getLongValue(payload, "ngoId");
        Long participantId = getLongValue(payload, "participantId");
        
        // If ngoId and participantId are provided, use them
        // Otherwise, try to infer from senderId and receiverId
        if (ngoId == null || participantId == null) {
            // This is a simplified approach - in production, you'd check user roles
            // For now, assume senderId is NGO if it's provided as ngoId, otherwise participant
            ngoId = getLongValue(payload, "ngoId");
            participantId = getLongValue(payload, "participantId");
            
            // If still null, use senderId and receiverId
            if (ngoId == null && participantId == null) {
                // Default: assume sender is NGO, receiver is participant
                // In production, fetch user roles from user service
                ngoId = senderId;
                participantId = getLongValue(payload, "receiverId");
            }
        }
        
        String conversationId = generateConversationId(ngoId, participantId);
        
        // Create or update conversation metadata
        Map<String, Object> metadata = conversationMetadata.computeIfAbsent(conversationId, k -> {
            Map<String, Object> meta = new HashMap<>();
            meta.put("conversationId", conversationId);
            meta.put("ngoId", ngoId);
            meta.put("participantId", participantId);
            meta.put("createdAt", Instant.now().toString());
            return meta;
        });
        metadata.put("lastMessageTime", Instant.now().toString());
        
        // Create message
        Map<String, Object> msg = new HashMap<>();
        msg.put("id", UUID.randomUUID().toString());
        msg.put("conversationId", conversationId);
        msg.put("senderId", senderId);
        msg.put("receiverId", receiverId);
        msg.put("text", text);
        msg.put("timestamp", Instant.now().toString());
        
        // Store message
        conversations.computeIfAbsent(conversationId, k -> new CopyOnWriteArrayList<>()).add(msg);
        
        return ResponseEntity.ok(Map.of("data", msg));
    }

    /**
     * Get or create a conversation between NGO and Participant
     */
    @PostMapping("/conversations")
    public ResponseEntity<Map<String, Object>> getOrCreateConversation(@RequestBody Map<String, Object> payload) {
        Long ngoId = getLongValue(payload, "ngoId");
        Long participantId = getLongValue(payload, "participantId");
        
        if (ngoId == null || participantId == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Missing required fields: ngoId, participantId"));
        }
        
        String conversationId = generateConversationId(ngoId, participantId);
        
        Map<String, Object> metadata = conversationMetadata.computeIfAbsent(conversationId, k -> {
            Map<String, Object> meta = new HashMap<>();
            meta.put("conversationId", conversationId);
            meta.put("ngoId", ngoId);
            meta.put("participantId", participantId);
            meta.put("createdAt", Instant.now().toString());
            meta.put("lastMessageTime", Instant.now().toString());
            return meta;
        });
        
        return ResponseEntity.ok(Map.of("data", metadata));
    }

    // Helper methods
    private String generateConversationId(Long ngoId, Long participantId) {
        // Generate consistent conversation ID: ngoId_participantId (sorted)
        if (ngoId == null || participantId == null) {
            return UUID.randomUUID().toString();
        }
        return ngoId + "_" + participantId;
    }

    private Long getLongValue(Map<String, Object> map, String key) {
        Object value = map.get(key);
        if (value == null) return null;
        if (value instanceof Number) {
            return ((Number) value).longValue();
        }
        try {
            return Long.parseLong(String.valueOf(value));
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private String getStringValue(Map<String, Object> map, String key) {
        Object value = map.get(key);
        return value != null ? String.valueOf(value) : null;
    }

    private Instant parseInstant(String str) {
        if (str == null || str.isEmpty()) {
            return Instant.MIN;
        }
        try {
            return Instant.parse(str);
        } catch (Exception e) {
            return Instant.MIN;
        }
    }
}




