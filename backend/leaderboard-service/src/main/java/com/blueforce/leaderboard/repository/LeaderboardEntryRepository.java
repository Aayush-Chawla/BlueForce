package com.blueforce.leaderboard.repository;

import com.blueforce.leaderboard.model.LeaderboardEntry;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LeaderboardEntryRepository extends JpaRepository<LeaderboardEntry, Long> {
    Page<LeaderboardEntry> findByUserRoleOrderByXpDescTotalWasteCollectedKgDesc(String userRole, Pageable pageable);
}
