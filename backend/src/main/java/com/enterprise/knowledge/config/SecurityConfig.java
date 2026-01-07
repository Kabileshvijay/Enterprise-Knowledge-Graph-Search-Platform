package com.enterprise.knowledge.config;

import com.enterprise.knowledge.jwt.JwtFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                // ✅ CORS
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // ✅ Disable CSRF (JWT + HttpOnly cookies)
                .csrf(csrf -> csrf.disable())

                // ✅ Stateless
                .sessionManagement(sm ->
                        sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // ✅ AUTHORIZATION (ORDER MATTERS)
                .authorizeHttpRequests(auth -> auth

                        // 🔥 PRE-FLIGHT
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // 🌍 PUBLIC
                        .requestMatchers(
                                "/",
                                "/error",
                                "/actuator/health",
                                "/api/employees/login",
                                "/api/employees/register",
                                "/api/employees/logout"
                        ).permitAll()

                        // 🔐 ADMIN ONLY (AUTHORITY — NOT ROLE)
                        .requestMatchers(
                                "/api/employees",
                                "/api/admin/**",
                                "/api/analytics/**"
                        ).hasAuthority("ADMIN")

                        // 👤 AUTHENTICATED USERS
                        .requestMatchers(
                                "/api/employees/me",
                                "/api/notifications/**",
                                "/api/documents/**",
                                "/api/comments/**",
                                "/api/feedback"
                        ).authenticated()

                        .anyRequest().authenticated()
                )

                // ✅ JWT FILTER
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // 🔐 Password Encoder
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // 🌍 CORS CONFIG
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration config = new CorsConfiguration();

        config.setAllowedOrigins(List.of(
                "http://localhost:5173",
                "https://entrograph.vercel.app"
        ));

        config.setAllowedMethods(List.of(
                "GET", "POST", "PUT", "DELETE", "OPTIONS"
        ));

        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
