from fastapi import FastAPI, Query
import requests
import json

app = FastAPI()

ELASTICSEARCH_URL = "http://localhost:9200/repositories/_search"

@app.get("/search")
def search_repos(
    query: str = Query(..., min_length=3),
    language: str = None,
    created_from: str = None,  # Format YYYY-MM-DD
    created_to: str = None,    # Format YYYY-MM-DD
    min_stars: int = None,
    min_forks: int = None
):
    """Wyszukuje repozytoria w Elasticsearch z dodatkowymi filtrami."""
    
    filters = []
    if language:
        filters.append({"match": {"language": language}})
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
    
    es_query = {
        "query": {
            "bool": {
                "must": [{"match": {"name": query}}],
                "filter": filters
            }
        }
    }
    
    print("Zapytanie do Elasticsearch:", json.dumps(es_query, indent=2))
    res = requests.get(ELASTICSEARCH_URL, json=es_query).json()
    print("Odpowiedź Elasticsearch:", json.dumps(res, indent=2))
    
    return [hit["_source"] for hit in res["hits"]["hits"]]
