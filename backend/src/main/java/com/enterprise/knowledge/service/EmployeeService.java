package com.enterprise.knowledge.service;

import com.enterprise.knowledge.dto.EmployeeRequest;
import com.enterprise.knowledge.dto.LoginRequest;
import com.enterprise.knowledge.entity.Employee;
import com.enterprise.knowledge.repository.EmployeeRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class EmployeeService {

    private final EmployeeRepository repository;
    private final PasswordEncoder passwordEncoder; // 🔹 added for encryption

    public EmployeeService(EmployeeRepository repository,
                           PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    /* ================= REGISTER ================= */

    public Employee saveEmployee(EmployeeRequest request) {

        if (repository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("EMAIL_ALREADY_EXISTS");
        }

        Employee employee = new Employee();
        employee.setName(request.getName());
        employee.setEmail(request.getEmail());
        employee.setTeam(request.getTeam());
        employee.setSkills(request.getSkills());

        // 🔐 Encrypt password
        employee.setPassword(passwordEncoder.encode(request.getPassword()));

        // 🔹 Default role
        employee.setRole("EMPLOYEE");

        return repository.save(employee);
    }

    /* ================= LOGIN ================= */

    public Employee login(LoginRequest request) {

        Employee employee = repository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("EMPLOYEE_NOT_FOUND"));

        // 🔐 Validate password
        if (!passwordEncoder.matches(request.getPassword(), employee.getPassword())) {
            throw new RuntimeException("INVALID_PASSWORD");
        }

        return employee;
    }

    /* ================= GET EMPLOYEE BY EMAIL ================= */

    public Employee getEmployeeByEmail(String email) {
        return repository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("EMPLOYEE_NOT_FOUND"));
    }
}
