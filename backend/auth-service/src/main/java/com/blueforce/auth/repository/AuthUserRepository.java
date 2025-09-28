package com.blueforce.auth.repository;

import com.blueforce.auth.entity.AuthUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AuthUserRepository extends JpaRepository<AuthUser, Long> {

    boolean existsByEmail(String email);

    Optional<AuthUser> findByEmail(String email);
}