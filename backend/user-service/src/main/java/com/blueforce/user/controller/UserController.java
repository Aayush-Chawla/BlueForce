package com.blueforce.user.controller;

import com.blueforce.user.dto.profile.*;
import com.blueforce.user.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    // ✅ Get Profile (auto role-detection by service)
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(userService.getUserProfile(email));
    }

    // ✅ Update Profile (Admin)
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/me/admin")
    public ResponseEntity<?> updateAdmin(@RequestBody @Valid UpdateAdminProfileDto updateDto) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        AdminProfileDto updated = userService.updateAdminProfile(email, updateDto);
        return ResponseEntity.ok(updated);
    }

    // ✅ Update Profile (NGO)
    @PreAuthorize("hasRole('NGO')") // make sure role string matches how you set role in token (e.g., "NGO")
    @PutMapping("/me/ngo")
    public ResponseEntity<?> updateNGO(@RequestBody @Valid UpdateNGOProfileDto updateDto) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        NgoProfileDto updated = userService.updateNGOProfile(email, updateDto);
        return ResponseEntity.ok(updated);
    }

    // ✅ Update Profile (Participant)
    @PreAuthorize("hasRole('PARTICIPANT')")
    @PutMapping("/me/participant")
    public ResponseEntity<?> updateParticipant(@RequestBody @Valid UpdateParticipantProfileDto updateDto) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        ParticipantProfileDto updated = userService.updateParticipantProfile(email, updateDto);
        return ResponseEntity.ok(updated);
    }

    // ✅ Soft Delete Account
    @DeleteMapping("/me")
    public ResponseEntity<String> deleteAccount() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        userService.deactivateUser(email);
        return ResponseEntity.ok("Account deactivated successfully");
    }

    // Get profile by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(userService.getUserProfileById(id));
        } catch (RuntimeException ex) {
            if (ex.getMessage() != null && ex.getMessage().toLowerCase().contains("not found")) {
                return ResponseEntity.status(404).body(java.util.Map.of("success", false, "message", "User not found"));
            }
            throw ex;
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("")
    public ResponseEntity<?> getUsers(
            @RequestParam(value = "role", required = false) String role,
            @RequestParam(value = "verified", required = false) Boolean verified,
            @RequestParam(value = "page", required = false) Integer page,
            @RequestParam(value = "size", required = false) Integer size
    ) {
        int pageNum = page != null ? page : 0, pageSize = size != null ? size : 25;
        Pageable pageable = PageRequest.of(pageNum, pageSize);
        var result = userService.getUsersFiltered(role, verified, pageable);
        return ResponseEntity.ok(java.util.Map.of(
            "success", true,
            "users", result.getContent(),
            "total", result.getTotalElements(),
            "page", pageNum,
            "size", pageSize
        ));
    }
}
