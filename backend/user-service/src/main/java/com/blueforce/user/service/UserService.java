package com.blueforce.user.service;

import com.blueforce.user.dto.profile.*;
import com.blueforce.user.entity.User;
import com.blueforce.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;


    // ✅ Get Profile (role-specific)
    public Object getUserProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return switch (user.getRole().toUpperCase()) {
            case "ADMIN" -> new AdminProfileDto(
                    user.getId(), user.getEmail(), user.getRole(),
                    user.getName(), user.getPhone()
            );
            case "NGO" -> new NgoProfileDto(
                    user.getId(), user.getEmail(), user.getRole(),
                    user.getOrganizationName(), user.getContactPerson(),
                    user.getPhone(), user.getAddress()
            );
            case "PARTICIPANT" -> new ParticipantProfileDto(
                    user.getId(), user.getEmail(), user.getRole(),
                    user.getName(), user.getPhone(), user.getAddress(), user.getPoints()
            );
            default -> throw new RuntimeException("Unsupported role");
        };
    }

    // ✅ Update Profile (Admin only)
    public AdminProfileDto updateAdminProfile(String email, UpdateAdminProfileDto dto) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setName(dto.getFullName());
        user.setPhone(dto.getPhone());

        User updatedUser = userRepository.save(user);
        return new AdminProfileDto(
                updatedUser.getId(), updatedUser.getEmail(), updatedUser.getRole(),
                updatedUser.getName(), updatedUser.getPhone()
        );
    }

    // ✅ Update Profile (NGO only)
    public NgoProfileDto updateNGOProfile(String email, UpdateNGOProfileDto dto) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setOrganizationName(dto.getOrganizationName());
        user.setContactPerson(dto.getContactPerson());
        user.setPhone(dto.getPhone());
        user.setAddress(dto.getAddress());

        User updatedUser = userRepository.save(user);
        return new NgoProfileDto(
                updatedUser.getId(), updatedUser.getEmail(), updatedUser.getRole(),
                updatedUser.getOrganizationName(), updatedUser.getContactPerson(),
                updatedUser.getPhone(), updatedUser.getAddress()
        );
    }

    // ✅ Update Profile (Participant only)
    public ParticipantProfileDto updateParticipantProfile(String email, UpdateParticipantProfileDto dto) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setName(dto.getFullName());
        user.setPhone(dto.getPhone());
        user.setAddress(dto.getAddress());

        User updatedUser = userRepository.save(user);
        return new ParticipantProfileDto(
                updatedUser.getId(), updatedUser.getEmail(), updatedUser.getRole(),
                updatedUser.getName(), updatedUser.getPhone(),
                updatedUser.getAddress(), updatedUser.getPoints()
        );
    }

    // ✅ Soft Delete
    public void deactivateUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setActive(false);
        userRepository.save(user);
    }
}
