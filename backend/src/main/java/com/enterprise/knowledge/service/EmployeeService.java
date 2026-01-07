package com.enterprise.knowledge.service;

import com.enterprise.knowledge.dto.EmployeeRequest;
import com.enterprise.knowledge.dto.LoginRequest;
import com.enterprise.knowledge.dto.LoginSuccessResponse;
import com.enterprise.knowledge.entity.Employee;
import com.enterprise.knowledge.repository.EmployeeRepository;
import com.enterprise.knowledge.jwt.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeService {

    private final EmployeeRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public EmployeeService(EmployeeRepository repository,
                           PasswordEncoder passwordEncoder,
                           JwtUtil jwtUtil) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
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

        // 🔐 Encrypt password (CORRECT)
        employee.setPassword(
                passwordEncoder.encode(request.getPassword())
        );

        // ✅ IMPORTANT: must match Spring Security rules
        employee.setRole("ROLE_EMPLOYEE");

        return repository.save(employee);
    }

    /* ================= LOGIN ================= */

    public LoginSuccessResponse login(LoginRequest request) {

        Employee employee = repository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("EMPLOYEE_NOT_FOUND"));

        // 🔐 Correct password validation
        if (!passwordEncoder.matches(
                request.getPassword(),
                employee.getPassword()
        )) {
            throw new RuntimeException("INVALID_PASSWORD");
        }

        // 🔑 Generate JWT
        String token = jwtUtil.generateToken(
                employee.getEmail(),
                employee.getRole()
        );

        // ✅ Return token + user
        return new LoginSuccessResponse(token, employee);
    }

    /* ================= GET EMPLOYEE ================= */

    public Employee getEmployeeByEmail(String email) {
        return repository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("EMPLOYEE_NOT_FOUND"));
    }

    public List<Employee> getAllEmployees() {
        return repository.findAll();
    }

    public void deleteByEmail(String email) {
        repository.deleteByEmail(email);
    }
}
