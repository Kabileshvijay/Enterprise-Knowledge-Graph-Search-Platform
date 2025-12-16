package com.enterprise.knowledge.service;

import com.enterprise.knowledge.dto.EmployeeRequest;
import com.enterprise.knowledge.dto.LoginRequest;
import com.enterprise.knowledge.entity.Employee;
import com.enterprise.knowledge.repository.EmployeeRepository;
import org.springframework.stereotype.Service;

@Service
public class EmployeeService {

    private final EmployeeRepository repository;

    public EmployeeService(EmployeeRepository repository) {
        this.repository = repository;
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
        employee.setPassword(request.getPassword()); // encrypt later
        employee.setSkills(request.getSkills());

        return repository.save(employee);
    }

    /* ================= LOGIN ================= */

    public Employee login(LoginRequest request) {

        Employee employee = repository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("EMPLOYEE_NOT_FOUND"));

        if (!employee.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("INVALID_PASSWORD");
        }

        return employee;
    }
}
