package com.blueforce.user.config;

import com.blueforce.user.entity.User;
import com.blueforce.user.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);
    private static final String SUPER_ADMIN_EMAIL = "admin@blueforce.com";
    private static final String SUPER_ADMIN_ROLE = "SUPERADMIN";

    @Autowired
    private UserRepository userRepository;

    @Override
    public void run(String... args) throws Exception {
        // Create super admin user if it doesn't exist
        if (!userRepository.findByEmail(SUPER_ADMIN_EMAIL).isPresent()) {
            logger.info("Creating super admin user in user-service: {}", SUPER_ADMIN_EMAIL);
            
            User superAdmin = User.builder()
                    .email(SUPER_ADMIN_EMAIL)
                    .role(SUPER_ADMIN_ROLE)
                    .name("Super Admin")
                    .active(true)
                    .build();

            userRepository.save(superAdmin);
            logger.info("Super admin user created successfully in user-service");
        } else {
            logger.info("Super admin user already exists in user-service");
        }
    }
}

