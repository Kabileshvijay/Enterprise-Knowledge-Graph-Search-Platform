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

    public EmployeeService(
            EmployeeRepository repository,
            PasswordEncoder passwordEncoder
    ) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    /* ================= REGISTER ================= */

    public Employee saveEmployee(EmployeeRequest request) {

        if (repository.existsByEmail(request.getEmail())) {
            return null;
        }

        Employee employee = new Employee();
        employee.setName(request.getName());
        employee.setEmail(request.getEmail());
        employee.setTeam(request.getTeam());
        employee.setSkills(request.getSkills());

        // 🔐 Encrypt password
        employee.setPassword(passwordEncoder.encode(request.getPassword()));

        // ✅ STORE ROLE WITHOUT PREFIX (CRITICAL)
        // Allowed values in DB: ADMIN / EMPLOYEE
        employee.setRole("EMPLOYEE");

        return repository.save(employee);
    }

    /* ================= LOGIN ================= */

    public Employee login(LoginRequest request) {

        Employee employee = repository.findByEmail(request.getEmail())
                .orElse(null);

        if (employee == null) return null;

        if (!passwordEncoder.matches(
                request.getPassword(),
                employee.getPassword()
        )) {
            return null;
        }

        return employee;
    }

    /* ================= GET EMPLOYEE BY EMAIL ================= */

    public Employee getEmployeeByEmail(String email) {
        return repository.findByEmail(email).orElse(null);
    }

    /* ================= GET ALL ================= */

    public List<Employee> getAllEmployees() {
        return repository.findAll();
    }

    /* ================= DELETE ================= */

    public boolean deleteByEmail(String email) {

        if (!repository.existsByEmail(email)) {
            return false;
        }

        repository.deleteByEmail(email);
        return true;
    }
}
