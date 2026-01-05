package com.enterprise.knowledge.service;

import com.enterprise.knowledge.dto.PeopleResponse;
import com.enterprise.knowledge.entity.Employee;
import com.enterprise.knowledge.repository.DocumentLikeRepository;
import com.enterprise.knowledge.repository.DocumentRepository;
import com.enterprise.knowledge.repository.EmployeeRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class PeopleService {

    private final EmployeeRepository employeeRepository;
    private final DocumentRepository documentRepository;
    private final DocumentLikeRepository likeRepository;

    public PeopleService(
            EmployeeRepository employeeRepository,
            DocumentRepository documentRepository,
            DocumentLikeRepository likeRepository
    ) {
        this.employeeRepository = employeeRepository;
        this.documentRepository = documentRepository;
        this.likeRepository = likeRepository;
    }

    // ✅ PAGINATED PEOPLE LIST
    public Page<PeopleResponse> getPeople(Pageable pageable) {

        return employeeRepository
                .findByRoleNot("ADMIN", pageable)
                .map(emp -> {

                    long documentCount =
                            documentRepository.countPublishedByAuthorEmail(
                                    emp.getEmail()
                            );

                    long totalLikes =
                            likeRepository.countLikesByAuthorEmail(
                                    emp.getEmail()
                            );

                    return new PeopleResponse(
                            emp.getId(),
                            emp.getName(),
                            emp.getEmail(),
                            emp.getTeam(),
                            emp.getSkills(),
                            documentCount,
                            totalLikes
                    );
                });
    }

    // ✅ GET PERSON BY EMAIL (FOR DOCUMENTS PAGE TITLE)
    public PeopleResponse getByEmail(String email) {

        Employee emp = employeeRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("USER_NOT_FOUND")
                );

        long documentCount =
                documentRepository.countPublishedByAuthorEmail(email);

        long totalLikes =
                likeRepository.countLikesByAuthorEmail(email);

        return new PeopleResponse(
                emp.getId(),
                emp.getName(),
                emp.getEmail(),
                emp.getTeam(),
                emp.getSkills(),
                documentCount,
                totalLikes
        );
    }
}
