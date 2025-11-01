package com.blueforce.ngo.repository;

import com.blueforce.ngo.model.Ngo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NgoRepository extends JpaRepository<Ngo, Long> {
    Page<Ngo> findByVerified(boolean verified, Pageable pageable);
    Page<Ngo> findByOwnerUserId(Long ownerUserId, Pageable pageable);
}

