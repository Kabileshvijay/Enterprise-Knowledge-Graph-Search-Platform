package com.enterprise.knowledge.repository;

import com.enterprise.knowledge.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


import java.util.List;
import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    boolean existsByEmail(String email);

    Optional<Employee> findByEmail(String email);

    @Modifying
    @Query("DELETE FROM Employee e WHERE e.email = :email")
    void deleteByEmail(@Param("email") String email);


    List<Employee> findByRoleNot(String role);

    Page<Employee> findByRoleNot(String role, Pageable pageable);
}
