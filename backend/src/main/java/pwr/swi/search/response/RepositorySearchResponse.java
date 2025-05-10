package pwr.swi.search.response;

import lombok.Data;

import java.util.List;

@Data
public class RepositorySearchResponse {
    private String name;
    private String description;
    private String language;
    private String license;
    private String url;
    private String createdAt;
    private String updatedAt;
    private int stars;
    private int forks;
    private int issues;
    private int size;
    private List<String> tags;

    public RepositorySearchResponse(String name, String description, String language, String license,
                                    String url, String createdAt, String updatedAt, int stars, int forks,
                                    int issues, int size, List<String> tags) {
        this.name = name;
        this.description = description;
        this.language = language;
        this.license = license;
        this.url = url;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.stars = stars;
        this.forks = forks;
        this.issues = issues;
        this.size = size;
        this.tags = tags;
    }
}
