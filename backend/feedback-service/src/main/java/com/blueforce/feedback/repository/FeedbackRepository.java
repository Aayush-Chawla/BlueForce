package com.blueforce.feedback.repository;

import com.blueforce.feedback.model.Feedback;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    Page<Feedback> findByEventIdOrderByCreatedAtDesc(Long eventId, Pageable pageable);
}




