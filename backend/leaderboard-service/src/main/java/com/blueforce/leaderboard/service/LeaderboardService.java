package com.blueforce.leaderboard.service;

import com.blueforce.leaderboard.model.LeaderboardEntry;
import com.blueforce.leaderboard.repository.LeaderboardEntryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
public class LeaderboardService {

    @Autowired
    private LeaderboardEntryRepository repository;

    public Page<LeaderboardEntry> getLeaderboard(String role, int page, int limit) {
        String normalized = role == null ? "PARTICIPANT" : role.trim().equalsIgnoreCase("ngo") ? "NGO" : "PARTICIPANT";
        return repository.findByUserRoleOrderByXpDescTotalWasteCollectedKgDesc(normalized, PageRequest.of(page, limit));
    }
}
