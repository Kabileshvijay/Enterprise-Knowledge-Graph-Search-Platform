package com.enterprise.knowledge.controller;

import com.enterprise.knowledge.dto.EmployeeRequest;
import com.enterprise.knowledge.dto.LoginRequest;
import com.enterprise.knowledge.dto.LoginSuccessResponse;
import com.enterprise.knowledge.entity.Employee;
import com.enterprise.knowledge.jwt.JwtUtil;
import com.enterprise.knowledge.service.EmployeeService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin(
        origins = "http://localhost:5173",
        allowCredentials = "true"
)
public class EmployeeController {

    private final EmployeeService service;
    private final JwtUtil jwtUtil;

    public EmployeeController(EmployeeService service, JwtUtil jwtUtil) {
        this.service = service;
        this.jwtUtil = jwtUtil;
    }

    /* ================= REGISTER (UNCHANGED) ================= */

    @PostMapping("/register")
    public Employee registerEmployee(@RequestBody EmployeeRequest request) {
        return service.saveEmployee(request);
    }

    /* ================= LOGIN (UPDATED: JWT + COOKIE) ================= */

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {

        Employee employee = service.login(request);

        String token = jwtUtil.generateToken(
                employee.getEmail(),
                employee.getRole()
        );

        ResponseCookie cookie = ResponseCookie.from("jwt", token)
                .httpOnly(true)
                .secure(true)          // true in production
                .path("/")
                .maxAge(24 * 60 * 60)
                .sameSite("None")        // IMPORTANT for localhost
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(new LoginSuccessResponse(
                        employee.getName(),
                        employee.getEmail(),
                        employee.getRole()
                ));
    }

    /* ================= GET LOGGED-IN USER (NEW) ================= */

    @GetMapping("/me")
    public ResponseEntity<?> getLoggedInUser(Authentication authentication) {

        String email = authentication.getName(); // extracted from JWT
        Employee employee = service.getEmployeeByEmail(email);

        return ResponseEntity.ok(
                new LoginSuccessResponse(
                        employee.getName(),
                        employee.getEmail(),
                        employee.getRole()
                )
        );
    }

    /* ================= GET EMPLOYEE BY EMAIL (UNCHANGED) ================= */

    @GetMapping("/by-email")
    public Employee getEmployeeByEmail(@RequestParam String email) {
        return service.getEmployeeByEmail(email);
    }

    /* ================= LOGOUT (NEW) ================= */

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {

        ResponseCookie deleteCookie = ResponseCookie.from("jwt", "")
                .httpOnly(true)
                .path("/")
                .maxAge(0)
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, deleteCookie.toString())
                .body("LOGOUT_SUCCESS");
    }

    /* ================= ADMIN: GET ALL EMPLOYEES ================= */

    @GetMapping
    public ResponseEntity<?> getAllEmployees() {
        return ResponseEntity.ok(service.getAllEmployees());
    }

    /* ================= ADMIN: DELETE EMPLOYEE ================= */

    @DeleteMapping("/{email}")
    public ResponseEntity<?> deleteEmployee(@PathVariable String email) {
        service.deleteByEmail(email);
        return ResponseEntity.ok("DELETED");
    }
}


