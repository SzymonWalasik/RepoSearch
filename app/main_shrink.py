from fastapi import FastAPI, Query
import requests
import json
from typing import List, Optional

app = FastAPI()

ELASTICSEARCH_URL = "http://localhost:9200/shrinked-repositories/_search"

@app.get("/search-shrink")
def search_repos(
    query: Optional[str] = Query(None, min_length=3),
    language: Optional[str] = None,
    created_from: Optional[str] = None,
    created_to: Optional[str] = None,
    min_stars: Optional[int] = None,
    min_forks: Optional[int] = None,
    license: Optional[str] = None,
    topics: Optional[List[str]] = Query(None)
):
    """Wyszukuje repozytoria w Elasticsearch z dodatkowymi filtrami."""
    
    filters = []
    if language:
        filters.append({"match": {"language": language}})
    
    if license:
        filters.append({"match": {"license": license}})
    
    if topics:
        filters.append({"terms": {"topics": topics}})
    
    if created_from or created_to:
        date_range = {}
        if created_from:
            date_range["gte"] = created_from
        if created_to:
            date_range["lte"] = created_to
        filters.append({"range": {"created_at": date_range}})
    
    if min_stars:
        filters.append({"range": {"stars": {"gte": min_stars}}})
    
    if min_forks:
        filters.append({"range": {"forks": {"gte": min_forks}}})

    # Budowanie zapytania
    must_clause = [{"match": {"name": query}}] if query else []

    es_query = {
        "query": {
            "bool": {
                "must": must_clause,
                "filter": filters
            }
        }
    }

    print("Zapytanie do Elasticsearch:", json.dumps(es_query, indent=2))
    
    res = requests.get(ELASTICSEARCH_URL, json=es_query).json()
    
    print("Odpowiedź Elasticsearch:", json.dumps(res, indent=2))
    
    return [hit["_source"] for hit in res["hits"]["hits"]]
