package com.enterprise.knowledge.controller;

import com.enterprise.knowledge.dto.EmployeeRequest;
import com.enterprise.knowledge.dto.LoginRequest;
import com.enterprise.knowledge.dto.LoginSuccessResponse;
import com.enterprise.knowledge.entity.Employee;
import com.enterprise.knowledge.jwt.JwtUtil;
import com.enterprise.knowledge.service.EmployeeService;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin(
        origins = "https://entrograph.vercel.app",
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
    public ResponseEntity<?> registerEmployee(@RequestBody EmployeeRequest request) {

        Employee emp = service.saveEmployee(request);
        if (emp == null) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("EMAIL_ALREADY_EXISTS");
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(emp);
    }

    /* ================= LOGIN ================= */

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {

        Employee employee = service.login(request);
        if (employee == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("INVALID_CREDENTIALS");
        }

        String token = jwtUtil.generateToken(
                employee.getEmail(),
                employee.getRole()
        );

        // 🔐 IMPORTANT: domain + sameSite + secure
        ResponseCookie cookie = ResponseCookie.from("jwt", token)
                .httpOnly(true)
                .secure(true)
                .sameSite("None")
                .path("/")
                .domain("enterprise-knowledge-graph-search.onrender.com")
                .maxAge(24 * 60 * 60)
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(new LoginSuccessResponse(
                        employee.getName(),
                        employee.getEmail(),
                        employee.getRole()
                ));
    }

    /* ================= CURRENT USER ================= */

    @GetMapping("/me")
    public ResponseEntity<?> getLoggedInUser(Authentication authentication) {

        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Employee employee =
                service.getEmployeeByEmail(authentication.getName());

        if (employee == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

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
    public ResponseEntity<?> logout() {

        // ❗ Must match login cookie attributes
        ResponseCookie deleteCookie = ResponseCookie.from("jwt", "")
                .httpOnly(true)
                .secure(true)
                .sameSite("None")
                .path("/")
                .domain("enterprise-knowledge-graph-search.onrender.com")
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
    @Transactional
    public ResponseEntity<?> deleteEmployee(
            @PathVariable String email,
            Authentication authentication
    ) {

        if (authentication != null &&
                authentication.getName().equals(email)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("CANNOT_DELETE_SELF");
        }

        boolean deleted = service.deleteByEmail(email);
        if (!deleted) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("EMPLOYEE_NOT_FOUND");
        }

        return ResponseEntity.ok("DELETED");
    }
}
