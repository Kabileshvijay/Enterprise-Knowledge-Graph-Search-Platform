package com.enterprise.knowledge.config;

import com.enterprise.knowledge.entity.Employee;
import com.enterprise.knowledge.repository.EmployeeRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AdminInitializer {

    @Bean
    CommandLineRunner createAdmin(
            EmployeeRepository employeeRepository,
            PasswordEncoder passwordEncoder
    ) {
        return args -> {

            boolean adminExists =
                    employeeRepository.existsByEmail("admin@gmail.com");

            if (!adminExists) {

                Employee admin = new Employee();
                admin.setName("Admin");
                admin.setEmail("admin@gmail.com");
                admin.setTeam("Admin Team");

                // ✅ MUST match Spring Security
                admin.setRole("ROLE_ADMIN");

                // ✅ Use shared PasswordEncoder bean
                admin.setPassword(
                        passwordEncoder.encode("123")
                );

                admin.setSkills(null);

                employeeRepository.save(admin);

                System.out.println("✅ ADMIN USER CREATED SUCCESSFULLY");
            } else {
                System.out.println("ℹ️ Admin already exists");
            }
        };
    }
}
