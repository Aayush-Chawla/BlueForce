package com.blueforce.auth.config;

import com.blueforce.auth.entity.AuthProviderType;
import com.blueforce.auth.entity.AuthUser;
import com.blueforce.auth.repository.AuthUserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);
    private static final String SUPER_ADMIN_EMAIL = "admin@blueforce.com";
    private static final String SUPER_ADMIN_PASSWORD = "password";
    private static final String SUPER_ADMIN_ROLE = "superadmin";

    @Autowired
    private AuthUserRepository authUserRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Create super admin if it doesn't exist
        if (!authUserRepository.existsByEmail(SUPER_ADMIN_EMAIL)) {
            logger.info("Creating super admin user: {}", SUPER_ADMIN_EMAIL);
            
            AuthUser superAdmin = AuthUser.builder()
                    .email(SUPER_ADMIN_EMAIL)
                    .passwordHash(passwordEncoder.encode(SUPER_ADMIN_PASSWORD))
                    .role(SUPER_ADMIN_ROLE)
                    .provider(AuthProviderType.LOCAL)
                    .verified(true) // Super admin is pre-verified
                    .build();

            authUserRepository.save(superAdmin);
            logger.info("Super admin user created successfully");
        } else {
            logger.info("Super admin user already exists");
        }
    }
}




