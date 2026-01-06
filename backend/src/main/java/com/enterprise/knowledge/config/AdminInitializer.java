package com.enterprise.knowledge.config;

import com.enterprise.knowledge.entity.Employee;
import com.enterprise.knowledge.repository.EmployeeRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration
public class AdminInitializer {

    @Bean
    CommandLineRunner createAdmin(EmployeeRepository employeeRepository) {
        return args -> {

            boolean adminExists =
                    employeeRepository.existsByEmail("admin@gmail.com");

            if (!adminExists) {

                Employee admin = new Employee();
                admin.setName("Admin");
                admin.setEmail("admin@gmail.com");
                admin.setTeam("Admin Team");
                admin.setRole("ADMIN");

                // encrypted password
                admin.setPassword(
                        new BCryptPasswordEncoder().encode("123")
                );

                // IMPORTANT: no skills for admin
                admin.setSkills(null);

                employeeRepository.save(admin);

                System.out.println("✅ ADMIN USER CREATED SUCCESSFULLY");
            } else {
                System.out.println("ℹ️ Admin already exists");
            }
        };
    }
}
