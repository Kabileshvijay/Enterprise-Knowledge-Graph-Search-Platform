package com.enterprise.knowledge.controller;

import com.enterprise.knowledge.dto.CommentDto;
import com.enterprise.knowledge.entity.Comment;
import com.enterprise.knowledge.entity.Employee;
import com.enterprise.knowledge.repository.EmployeeRepository;
import com.enterprise.knowledge.service.CommentService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
@CrossOrigin(
        origins = "http://localhost:5173",
        allowCredentials = "true"
)
public class CommentController {

    private final CommentService service;
    private final EmployeeRepository employeeRepository;

    public CommentController(
            CommentService service,
            EmployeeRepository employeeRepository
    ) {
        this.service = service;
        this.employeeRepository = employeeRepository;
    }

    /* ================= GET COMMENTS ================= */
    @GetMapping("/{documentId}")
    public List<Comment> getComments(@PathVariable Long documentId) {
        return service.getComments(documentId);
    }

    /* ================= ADD COMMENT ================= */
    @PostMapping
    public Comment addComment(@RequestBody CommentDto dto) {

        Authentication auth =
                SecurityContextHolder.getContext().getAuthentication();

        String email = auth.getName();

        Employee employee = employeeRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("EMPLOYEE_NOT_FOUND")
                );

        Comment comment = new Comment();
        comment.setDocumentId(dto.getDocumentId());
        comment.setParentId(dto.getParentId());
        comment.setText(dto.getText());
        comment.setAuthorEmail(email);
        comment.setAuthorName(employee.getName());

        return service.addComment(comment);
    }

    /* ================= EDIT COMMENT ================= */
    @PutMapping("/{id}")
    public Comment editComment(
            @PathVariable Long id,
            @RequestBody CommentDto dto
    ) {
        Authentication auth =
                SecurityContextHolder.getContext().getAuthentication();

        String email = auth.getName();

        Comment comment = service.getById(id);

        if (!comment.getAuthorEmail().equals(email)) {
            throw new RuntimeException("NOT_ALLOWED");
        }

        comment.setText(dto.getText());
        return service.addComment(comment);
    }

    /* ================= DELETE COMMENT (SOFT) ================= */
    @DeleteMapping("/{id}")
    public void deleteComment(@PathVariable Long id) {

        Authentication auth =
                SecurityContextHolder.getContext().getAuthentication();

        String email = auth.getName();

        Comment comment = service.getById(id);

        if (!comment.getAuthorEmail().equals(email)) {
            throw new RuntimeException("NOT_ALLOWED");
        }

        comment.setDeleted(true);
        comment.setText("This comment was deleted");
        service.addComment(comment);
    }
}
