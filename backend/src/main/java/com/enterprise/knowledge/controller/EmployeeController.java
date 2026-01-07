package com.enterprise.knowledge.controller;

import com.enterprise.knowledge.dto.EmployeeRequest;
import com.enterprise.knowledge.dto.LoginRequest;
import com.enterprise.knowledge.dto.LoginSuccessResponse;
import com.enterprise.knowledge.entity.Employee;
import com.enterprise.knowledge.jwt.JwtUtil;
import com.enterprise.knowledge.service.EmployeeService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin(
        origins = {
                "http://localhost:5173",
                "https://entrograph.vercel.app"
        },
        allowCredentials = "true"
)
public class EmployeeController {

    private final EmployeeService service;
    private final JwtUtil jwtUtil;

    public EmployeeController(EmployeeService service, JwtUtil jwtUtil) {
        this.service = service;
        this.jwtUtil = jwtUtil;
    }

    /* ================= REGISTER ================= */

    @PostMapping("/register")
    public ResponseEntity<Employee> register(
            @RequestBody EmployeeRequest request
    ) {
        return ResponseEntity.ok(service.saveEmployee(request));
    }

    /* ================= LOGIN (COOKIE-BASED JWT) ================= */

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest request
    ) {
        try {
            Employee employee = service.login(request);

            String token = jwtUtil.generateToken(
                    employee.getEmail(),
                    employee.getRole()
            );

            ResponseCookie cookie = ResponseCookie.from("jwt", token)
                    .httpOnly(true)
                    .secure(true)        // HTTPS (Render + Vercel)
                    .path("/")
                    .maxAge(24 * 60 * 60)
                    .sameSite("None")    // Cross-site cookie
                    .build();

            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, cookie.toString())
                    .body(new LoginSuccessResponse(
                            employee.getName(),
                            employee.getEmail(),
                            employee.getRole()
                    ));

        } catch (RuntimeException ex) {

            if ("INVALID_PASSWORD".equals(ex.getMessage())
                    || "EMPLOYEE_NOT_FOUND".equals(ex.getMessage())) {

                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body("INVALID_CREDENTIALS");
            }

            // Any other unexpected error
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("LOGIN_FAILED");
        }
    }

    /* ================= CURRENT USER ================= */

    @GetMapping("/me")
    public ResponseEntity<LoginSuccessResponse> me(
            Authentication authentication
    ) {
        String email = authentication.getName();
        Employee employee = service.getEmployeeByEmail(email);

        return ResponseEntity.ok(
                new LoginSuccessResponse(
                        employee.getName(),
                        employee.getEmail(),
                        employee.getRole()
                )
        );
    }

    /* ================= LOGOUT ================= */

    @PostMapping("/logout")
    public ResponseEntity<String> logout() {

        ResponseCookie deleteCookie = ResponseCookie.from("jwt", "")
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(0)
                .sameSite("None")
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, deleteCookie.toString())
                .body("LOGOUT_SUCCESS");
    }

    /* ================= ADMIN ================= */

    @GetMapping
    public ResponseEntity<List<Employee>> getAllEmployees() {
        return ResponseEntity.ok(service.getAllEmployees());
    }

    @DeleteMapping("/{email}")
    public ResponseEntity<String> deleteEmployee(
            @PathVariable String email
    ) {
        service.deleteByEmail(email);
        return ResponseEntity.ok("DELETED");
    }
}
