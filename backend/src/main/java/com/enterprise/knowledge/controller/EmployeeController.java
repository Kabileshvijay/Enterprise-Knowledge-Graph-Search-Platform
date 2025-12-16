package com.enterprise.knowledge.controller;

import com.enterprise.knowledge.dto.EmployeeRequest;
import com.enterprise.knowledge.dto.LoginRequest;
import com.enterprise.knowledge.entity.Employee;
import com.enterprise.knowledge.service.EmployeeService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = "http://localhost:5173") // Vite frontend
public class EmployeeController {

    private final EmployeeService service;

    public EmployeeController(EmployeeService service) {
        this.service = service;
    }

    /* ================= REGISTER ================= */

    @PostMapping("/register")
    public Employee registerEmployee(@RequestBody EmployeeRequest request) {
        return service.saveEmployee(request);
    }

    /* ================= LOGIN ================= */

    @PostMapping("/login")
    public Employee login(@RequestBody LoginRequest request) {
        return service.login(request);
    }
}
