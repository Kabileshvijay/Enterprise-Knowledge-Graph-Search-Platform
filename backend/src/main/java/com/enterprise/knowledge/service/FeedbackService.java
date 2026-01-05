package com.enterprise.knowledge.service;

import com.enterprise.knowledge.dto.FeedbackRequest;
import com.enterprise.knowledge.entity.Employee;
import com.enterprise.knowledge.entity.Feedback;
import com.enterprise.knowledge.repository.EmployeeRepository;
import com.enterprise.knowledge.repository.FeedbackRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Service
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final EmployeeRepository employeeRepository;

    // OS-SAFE UPLOAD PATH
    private static final String UPLOAD_DIR =
            System.getProperty("user.dir")
                    + File.separator + "uploads"
                    + File.separator + "feedback"
                    + File.separator;

    public FeedbackService(
            FeedbackRepository feedbackRepository,
            EmployeeRepository employeeRepository
    ) {
        this.feedbackRepository = feedbackRepository;
        this.employeeRepository = employeeRepository;
    }

    /* ================= SUBMIT FEEDBACK ================= */

    public void submitFeedback(
            FeedbackRequest request,
            MultipartFile screenshot,
            String email
    ) throws IOException {

        // Fetch employee using email from JWT
        Employee employee = employeeRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("EMPLOYEE_NOT_FOUND"));

        Feedback feedback = new Feedback();
        feedback.setName(employee.getName());
        feedback.setEmail(employee.getEmail());
        feedback.setType(request.getType());
        feedback.setMessage(request.getMessage());

        // DEFAULT STATUS
        feedback.setStatus("UNSOLVED");

        // 📸 Screenshot (optional)
        if (screenshot != null && !screenshot.isEmpty()) {

            File dir = new File(UPLOAD_DIR);
            if (!dir.exists()) {
                boolean created = dir.mkdirs();
                if (!created) {
                    throw new IOException("Failed to create upload directory: " + UPLOAD_DIR);
                }
            }

            String fileName =
                    UUID.randomUUID() + "_" + screenshot.getOriginalFilename();

            File dest = new File(dir, fileName);
            screenshot.transferTo(dest);

            // Store relative path (used later for serving images)
            feedback.setScreenshotPath("/uploads/feedback/" + fileName);
        }

        feedbackRepository.save(feedback);
    }

    /* ================= ADMIN: MARK AS SOLVED ================= */

    public void markAsSolved(Long feedbackId) {

        Feedback feedback = feedbackRepository.findById(feedbackId)
                .orElseThrow(() -> new RuntimeException("FEEDBACK_NOT_FOUND"));

        feedback.setStatus("SOLVED");
        feedbackRepository.save(feedback);
    }

    public List<Feedback> getAllFeedback() {
        return feedbackRepository.findAll();
    }
}
