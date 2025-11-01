package com.blueforce.badge.repository;

import com.blueforce.badge.model.Badge;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BadgeRepository extends JpaRepository<Badge, Long> {
    Optional<Badge> findByKey(String key);
}
