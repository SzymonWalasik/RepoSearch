package pwr.swi.search.service;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch._types.FieldValue;
import co.elastic.clients.elasticsearch._types.query_dsl.*;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.json.JsonData;
import org.springframework.stereotype.Service;
import pwr.swi.search.request.RepositorySearchRequest;
import pwr.swi.search.response.RepositorySearchResponse;

import java.io.IOException;
import java.util.*;

import static java.util.stream.Collectors.toList;

@Service
public class RepositorySearchService {

    private final ElasticsearchClient esClient;

    public RepositorySearchService(ElasticsearchClient esClient) {
        this.esClient = esClient;
    }

    public List<RepositorySearchResponse> searchRepositories(RepositorySearchRequest request) throws IOException {
        List<Query> mustQueries = new ArrayList<>();

        if (request.getTitle() != null && !request.getTitle().isEmpty()) {
            mustQueries.add(MatchQuery.of(m -> m.field("name").query(request.getTitle()))._toQuery());
        }

        if (request.getDescription() != null && !request.getDescription().isEmpty()) {
            mustQueries.add(MatchQuery.of(m -> m.field("description").query(request.getDescription()))._toQuery());
        }

        if (request.getTags() != null && !request.getTags().isEmpty()) {
            mustQueries.add(TermsQuery.of(t -> t.field("topics.keyword").terms(terms -> terms.value(request.getTags().stream()
                    .map(FieldValue::of)
                    .collect(toList()))))._toQuery());
        }

        if (request.getLanguages() != null && !request.getLanguages().isEmpty()) {
            mustQueries.add(TermsQuery.of(t -> t.field("language.keyword").terms(terms -> terms.value(request.getLanguages().stream()
                    .map(FieldValue::of)
                    .collect(toList()))))._toQuery());
        }

        if (request.getLicense() != null && !request.getLicense().isEmpty()) {
            mustQueries.add(TermsQuery.of(t -> t.field("license.keyword").terms(terms -> terms.value(request.getLicense().stream()
                    .map(FieldValue::of)
                    .collect(toList()))))._toQuery());
        }

        if (request.getDateRange() != null && request.getDateRange().size() == 2) {
            Date start = request.getDateRange().get(0);
            Date end = request.getDateRange().get(1);
            if (start != null && end != null) {
                mustQueries.add(RangeQuery.of(r -> r
                        .field("created_at")
                        .gte(JsonData.of(start))
                        .lte(JsonData.of(end))
                )._toQuery());
            }
        }

        Query finalQuery = BoolQuery.of(b -> b.must(mustQueries))._toQuery();

        SearchResponse<Map> response = esClient.search(s -> s
                        .index("repositories")
                        .query(finalQuery)
                        .size(100),
                Map.class
        );

        System.out.println("Elasticsearch response: " + response);

        return response.hits().hits().stream().map(hit -> {
            Map source = hit.source();
            
            List<String> topics = new ArrayList<>();
            Object topicsRaw = source.get("topics");
            if (topicsRaw instanceof String) {
                String raw = ((String) topicsRaw).replaceAll("[\\[\\]']", "");
                if (!raw.isBlank()) {
                    topics = Arrays.stream(raw.split(","))
                            .map(String::trim)
                            .filter(s -> !s.isEmpty())
                            .collect(toList());
                }
            } else if (topicsRaw instanceof List<?>) {
                topics = ((List<?>) topicsRaw).stream()
                        .filter(String.class::isInstance)
                        .map(String.class::cast)
                        .collect(toList());
            }

            return new RepositorySearchResponse(
                    (String) source.get("name"),
                    (String) source.get("description"),
                    (String) source.get("language"),
                    (String) source.get("license"),
                    (String) source.get("url"),
                    (String) source.get("created_at"),
                    (String) source.get("updated_at"),
                    ((Number) source.get("stars")).intValue(),
                    ((Number) source.get("forks")).intValue(),
                    ((Number) source.get("issues")).intValue(),
                    ((Number) source.get("size")).intValue(),
                    topics
            );
        }).collect(toList());
    }
}