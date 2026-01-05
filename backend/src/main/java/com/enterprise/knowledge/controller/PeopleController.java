package com.enterprise.knowledge.controller;

import com.enterprise.knowledge.dto.PeopleResponse;
import com.enterprise.knowledge.service.PeopleService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/people")
@CrossOrigin(
        origins = "http://localhost:5173",
        allowCredentials = "true"
)
public class PeopleController {

    private final PeopleService service;

    public PeopleController(PeopleService service) {
        this.service = service;
    }

    // ✅ PAGINATED PEOPLE LIST
    @GetMapping
    public Page<PeopleResponse> getPeople(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size
    ) {
        return service.getPeople(
                PageRequest.of(page, size, Sort.by("name").ascending())
        );
    }

    // ✅ GET PERSON BY EMAIL (FOR DOCUMENTS PAGE TITLE)
    @GetMapping("/by-email")
    public PeopleResponse getPersonByEmail(
            @RequestParam String email
    ) {
        return service.getByEmail(email);
    }
}
