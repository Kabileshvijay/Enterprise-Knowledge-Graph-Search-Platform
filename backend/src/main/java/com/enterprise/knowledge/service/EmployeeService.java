package com.enterprise.knowledge.service;

import com.enterprise.knowledge.dto.EmployeeRequest;
import com.enterprise.knowledge.dto.LoginRequest;
import com.enterprise.knowledge.entity.Employee;
import com.enterprise.knowledge.repository.EmployeeRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeService {

    private final EmployeeRepository repository;
    private final PasswordEncoder passwordEncoder;

    public EmployeeService(EmployeeRepository repository,
                           PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    /* ================= REGISTER ================= */

    public Employee saveEmployee(EmployeeRequest request) {

        if (repository.existsByEmail(request.getEmail())) {
            throw new IllegalStateException("EMAIL_ALREADY_EXISTS");
        }

        Employee employee = new Employee();
        employee.setName(request.getName());
        employee.setEmail(request.getEmail());
        employee.setTeam(request.getTeam());
        employee.setSkills(request.getSkills());

        // 🔐 BCrypt encode password
        employee.setPassword(
                passwordEncoder.encode(request.getPassword())
        );

        // ✅ Spring Security compatible role
        employee.setRole("ROLE_EMPLOYEE");

        return repository.save(employee);
    }

    /* ================= LOGIN ================= */

    public Employee login(LoginRequest request) {

        Employee employee = repository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new IllegalArgumentException("EMPLOYEE_NOT_FOUND")
                );

        if (!passwordEncoder.matches(
                request.getPassword(),
                employee.getPassword()
        )) {
            throw new IllegalArgumentException("INVALID_PASSWORD");
        }

        return employee;
    }

    /* ================= GET ================= */

    public Employee getEmployeeByEmail(String email) {
        return repository.findByEmail(email)
                .orElseThrow(() ->
                        new IllegalArgumentException("EMPLOYEE_NOT_FOUND")
                );
    }

    public List<Employee> getAllEmployees() {
        return repository.findAll();
    }

    public void deleteByEmail(String email) {
        repository.deleteByEmail(email);
    }
}
