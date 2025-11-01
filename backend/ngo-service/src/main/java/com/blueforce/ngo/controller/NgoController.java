package com.blueforce.ngo.controller;

import com.blueforce.ngo.model.Ngo;
import com.blueforce.ngo.repository.NgoRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ngos")
@RequiredArgsConstructor
@Slf4j
public class NgoController {

    private final NgoRepository repository;

    @GetMapping("")
    public ResponseEntity<?> list(@RequestParam(value = "verified", required = false) Boolean verified,
                                  @RequestParam(value = "page", required = false) Integer page,
                                  @RequestParam(value = "limit", required = false) Integer limit) {
        log.info("Listing NGOs - verified: {}, page: {}, limit: {}", verified, page, limit);
        
        int p = page != null ? page : 0;
        int l = limit != null ? limit : 25;
        
        Page<Ngo> result = verified == null 
            ? repository.findAll(PageRequest.of(p, l)) 
            : repository.findByVerified(verified, PageRequest.of(p, l));
        
        return ResponseEntity.ok(Map.of(
            "success", true, 
            "message", "OK", 
            "data", Map.of(
                "items", result.getContent(), 
                "total", result.getTotalElements(), 
                "page", p, 
                "limit", l
            )
        ));
    }

    @PostMapping("")
    @PreAuthorize("hasRole('NGO')")
    public ResponseEntity<?> create(@AuthenticationPrincipal Jwt jwt, @RequestBody @Valid Ngo ngo) {
        log.info("Creating NGO: {} by user: {}", ngo.getName(), jwt.getSubject());
        
        Long ownerId = Long.parseLong(
            jwt.getClaimAsString("user_id") != null 
                ? jwt.getClaimAsString("user_id") 
                : jwt.getSubject()
        );
        
        ngo.setId(null);
        ngo.setOwnerUserId(ownerId);
        ngo.setVerified(false);
        
        Ngo saved = repository.save(ngo);
        log.info("NGO created successfully with ID: {}", saved.getId());
        
        return ResponseEntity.ok(Map.of(
            "success", true, 
            "message", "NGO created successfully", 
            "data", Map.of("id", saved.getId())
        ));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('NGO','ADMIN')")
    public ResponseEntity<?> update(@AuthenticationPrincipal Jwt jwt, 
                                     @PathVariable Long id, 
                                     @RequestBody Ngo body) {
        log.info("Updating NGO: {} by user: {}", id, jwt.getSubject());
        
        Ngo ngo = repository.findById(id)
            .orElseThrow(() -> new RuntimeException("NGO not found with ID: " + id));
        
        String role = jwt.getClaimAsString("role");
        Long userId = Long.parseLong(
            jwt.getClaimAsString("user_id") != null 
                ? jwt.getClaimAsString("user_id") 
                : jwt.getSubject()
        );
        
        if (!"ADMIN".equalsIgnoreCase(role) && !ngo.getOwnerUserId().equals(userId)) {
            log.warn("Access denied: User {} attempted to update NGO {} owned by {}", userId, id, ngo.getOwnerUserId());
            throw new IllegalArgumentException("Forbidden: You do not have permission to update this NGO");
        }
        
        // Update fields if provided
        if (body.getName() != null) ngo.setName(body.getName());
        if (body.getLocation() != null) ngo.setLocation(body.getLocation());
        if (body.getContactEmail() != null) ngo.setContactEmail(body.getContactEmail());
        if (body.getContactPhone() != null) ngo.setContactPhone(body.getContactPhone());
        
        Ngo saved = repository.save(ngo);
        log.info("NGO updated successfully: {}", saved.getId());
        
        return ResponseEntity.ok(Map.of(
            "success", true, 
            "message", "NGO updated successfully", 
            "data", Map.of("id", saved.getId())
        ));
    }

    @PostMapping("/{id}/verify")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> verify(@PathVariable Long id) {
        log.info("Verifying NGO: {}", id);
        
        Ngo ngo = repository.findById(id)
            .orElseThrow(() -> new RuntimeException("NGO not found with ID: " + id));
        
        ngo.setVerified(true);
        repository.save(ngo);
        
        log.info("NGO verified successfully: {}", id);
        
        return ResponseEntity.ok(Map.of(
            "success", true, 
            "message", "NGO verified successfully"
        ));
    }
}

