package pwr.swi.search.request;

import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
public class RepositorySearchRequest {
    private String title;
    private String description;
    private List<String> tags;
    private List<String> languages;
    private List<String> license;
    private List<Date> dateRange;

}
