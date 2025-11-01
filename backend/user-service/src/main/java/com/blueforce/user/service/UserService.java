package com.blueforce.user.service;

import com.blueforce.user.dto.profile.*;
import com.blueforce.user.entity.User;
import com.blueforce.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;


    // ✅ Get Profile (role-specific)
    public Object getUserProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String role = user.getRole() == null ? "" : user.getRole().toUpperCase();
        // Map VOLUNTEER to PARTICIPANT for now
        if ("VOLUNTEER".equals(role)) {
            role = "PARTICIPANT";
        }

        return switch (role) {
            case "ADMIN" -> new AdminProfileDto(
                    user.getId(), user.getEmail(), user.getRole(),
                    user.getName(), user.getPhone(), user.getAvatar(), user.getBio()
            );
            case "NGO" -> new NgoProfileDto(
                    user.getId(), user.getEmail(), user.getRole(),
                    user.getOrganizationName(), user.getContactPerson(),
                    user.getPhone(), user.getAddress(), user.getAvatar(), user.getBio()
            );
            case "PARTICIPANT" -> new ParticipantProfileDto(
                    user.getId(), user.getEmail(), user.getRole(),
                    user.getName(), user.getPhone(), user.getAddress(), user.getPoints(),
                    user.getAvatar(), user.getBio()
            );
            default -> throw new RuntimeException("Unsupported role");
        };
    }

    public Object getUserProfileById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        String role = user.getRole() == null ? "" : user.getRole().toUpperCase();
        if ("VOLUNTEER".equals(role)) role = "PARTICIPANT";
        return switch (role) {
            case "ADMIN" -> new AdminProfileDto(
                    user.getId(), user.getEmail(), user.getRole(),
                    user.getName(), user.getPhone(), user.getAvatar(), user.getBio()
            );
            case "NGO" -> new NgoProfileDto(
                    user.getId(), user.getEmail(), user.getRole(),
                    user.getOrganizationName(), user.getContactPerson(),
                    user.getPhone(), user.getAddress(), user.getAvatar(), user.getBio()
            );
            case "PARTICIPANT" -> new ParticipantProfileDto(
                    user.getId(), user.getEmail(), user.getRole(),
                    user.getName(), user.getPhone(), user.getAddress(), user.getPoints(),
                    user.getAvatar(), user.getBio()
            );
            default -> throw new RuntimeException("User not found");
        };
    }

    // ✅ Update Profile (Admin only)
    public AdminProfileDto updateAdminProfile(String email, UpdateAdminProfileDto dto) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setName(dto.getFullName());
        user.setPhone(dto.getPhone());
        user.setAvatar(dto.getAvatar());
        user.setBio(dto.getBio());

        User updatedUser = userRepository.save(user);
        return new AdminProfileDto(
                updatedUser.getId(), updatedUser.getEmail(), updatedUser.getRole(),
                updatedUser.getName(), updatedUser.getPhone(), updatedUser.getAvatar(), updatedUser.getBio()
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
        user.setAvatar(dto.getAvatar());
        user.setBio(dto.getBio());

        User updatedUser = userRepository.save(user);
        return new NgoProfileDto(
                updatedUser.getId(), updatedUser.getEmail(), updatedUser.getRole(),
                updatedUser.getOrganizationName(), updatedUser.getContactPerson(),
                updatedUser.getPhone(), updatedUser.getAddress(), updatedUser.getAvatar(), updatedUser.getBio()
        );
    }

    // ✅ Update Profile (Participant only)
    public ParticipantProfileDto updateParticipantProfile(String email, UpdateParticipantProfileDto dto) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setName(dto.getFullName());
        user.setPhone(dto.getPhone());
        user.setAddress(dto.getAddress());
        user.setAvatar(dto.getAvatar());
        user.setBio(dto.getBio());

        User updatedUser = userRepository.save(user);
        return new ParticipantProfileDto(
                updatedUser.getId(), updatedUser.getEmail(), updatedUser.getRole(),
                updatedUser.getName(), updatedUser.getPhone(), updatedUser.getAddress(),
                updatedUser.getPoints(), updatedUser.getAvatar(), updatedUser.getBio()
        );
    }

    // ✅ Soft Delete
    public void deactivateUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setActive(false);
        userRepository.save(user);
    }

    public Page<Object> getUsersFiltered(String role, Boolean verified, Pageable pageable) {
        String filterRole = null;
        if (role != null) {
            String r = role.trim().toLowerCase();
            filterRole = switch (r) {
                case "admin" -> "ADMIN";
                case "ngo", "organizer" -> "NGO";
                case "participant", "volunteer" -> "PARTICIPANT";
                default -> null;
            };
        }
        
        // Filter at repository level for better performance
        Page<User> users;
        if (filterRole != null && verified != null) {
            users = userRepository.findByRoleAndActive(filterRole, verified, pageable);
        } else if (filterRole != null) {
            users = userRepository.findByRole(filterRole, pageable);
        } else if (verified != null) {
            users = userRepository.findByActive(verified, pageable);
        } else {
            users = userRepository.findAll(pageable);
        }
        
        // Map users to DTOs based on role
        return users.map(user -> {
            String thisRole = user.getRole() == null ? "" : user.getRole().toUpperCase();
            if ("VOLUNTEER".equals(thisRole)) thisRole = "PARTICIPANT";
            
            return switch (thisRole) {
                case "ADMIN" -> new AdminProfileDto(
                        user.getId(), user.getEmail(), user.getRole(),
                        user.getName(), user.getPhone(), user.getAvatar(), user.getBio()
                );
                case "NGO" -> new NgoProfileDto(
                        user.getId(), user.getEmail(), user.getRole(),
                        user.getOrganizationName(), user.getContactPerson(),
                        user.getPhone(), user.getAddress(), user.getAvatar(), user.getBio()
                );
                case "PARTICIPANT" -> new ParticipantProfileDto(
                        user.getId(), user.getEmail(), user.getRole(),
                        user.getName(), user.getPhone(), user.getAddress(), user.getPoints(),
                        user.getAvatar(), user.getBio()
                );
                default -> new AdminProfileDto(
                        user.getId(), user.getEmail(), user.getRole(),
                        user.getName(), user.getPhone(), user.getAvatar(), user.getBio()
                );
            };
        });
    }
}
