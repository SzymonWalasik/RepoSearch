package pwr.swi.search.controller;

import org.springframework.web.bind.annotation.*;
import pwr.swi.search.request.RepositorySearchRequest;
import pwr.swi.search.response.RepositorySearchResponse;
import pwr.swi.search.service.RepositorySearchService;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/repositories")
@CrossOrigin("*")
public class RepositorySearchController {

    private final RepositorySearchService repositorySearchService;

    public RepositorySearchController(RepositorySearchService repositorySearchService) {
        this.repositorySearchService = repositorySearchService;
    }

    @PostMapping("/search")
    public List<RepositorySearchResponse> searchRepositories(@RequestBody RepositorySearchRequest request) throws IOException {
        return repositorySearchService.searchRepositories(request);
    }
}
