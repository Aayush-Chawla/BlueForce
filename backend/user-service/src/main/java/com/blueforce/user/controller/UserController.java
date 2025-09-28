package com.blueforce.user.controller;

import com.blueforce.user.dto.profile.*;
import com.blueforce.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<AdminProfileDto> updateAdmin(@RequestBody UpdateAdminProfileDto updateDto) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        AdminProfileDto updated = userService.updateAdminProfile(email, updateDto);
        return ResponseEntity.ok(updated);
    }

    // ✅ Update Profile (NGO)
    @PreAuthorize("hasRole('NGO')") // make sure role string matches how you set role in token (e.g., "NGO")
    @PutMapping("/me/ngo")
    public ResponseEntity<NgoProfileDto> updateNGO(@RequestBody UpdateNGOProfileDto updateDto) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        NgoProfileDto updated = userService.updateNGOProfile(email, updateDto);
        return ResponseEntity.ok(updated);
    }

    // ✅ Update Profile (Participant)
    @PreAuthorize("hasRole('PARTICIPANT')")
    @PutMapping("/me/participant")
    public ResponseEntity<ParticipantProfileDto> updateParticipant(@RequestBody UpdateParticipantProfileDto updateDto) {
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
}
