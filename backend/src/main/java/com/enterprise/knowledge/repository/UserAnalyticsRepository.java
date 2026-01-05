package com.enterprise.knowledge.repository;

import com.enterprise.knowledge.entity.UserAnalytics;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserAnalyticsRepository
        extends JpaRepository<UserAnalytics, Long> {

    UserAnalytics findByUserEmail(String userEmail);
}
