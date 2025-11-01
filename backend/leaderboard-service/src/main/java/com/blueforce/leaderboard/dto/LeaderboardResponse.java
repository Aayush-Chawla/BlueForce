package com.blueforce.leaderboard.dto;

import lombok.*;

import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LeaderboardResponse {
    private boolean success;
    private String message;
    private Map<String, Object> data;

    public static LeaderboardResponse of(List<?> items, long total, int page, int limit) {
        return LeaderboardResponse.builder()
                .success(true)
                .message("OK")
                .data(Map.of(
                        "items", items,
                        "total", total,
                        "page", page,
                        "limit", limit
                ))
                .build();
    }
}
