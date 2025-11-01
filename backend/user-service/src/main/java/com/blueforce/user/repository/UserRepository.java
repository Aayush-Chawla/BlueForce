package com.blueforce.user.repository;

import com.blueforce.user.entity.User;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    
    Page<User> findByRole(String role, Pageable pageable);
    
    Page<User> findByActive(boolean active, Pageable pageable);
    
    Page<User> findByRoleAndActive(String role, boolean active, Pageable pageable);

    @Modifying
    @Transactional
    @Query("""
           UPDATE User u SET 
                u.role = :role, 
                u.active = :active
           WHERE u.email = :email
           """)
    int updateUserFields(@Param("email") String email,
                         @Param("role") String role,
                         @Param("active") boolean active);
}