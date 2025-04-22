import pandas as pd
from elasticsearch import Elasticsearch
from elasticsearch.helpers import bulk, BulkIndexError

INDEX_NAME = "repositories"

# Ładowanie danych z CSV
df = pd.read_csv("../data/repositories.csv")

es = Elasticsearch("http://localhost:9200")

import numpy as np
import json

def clean_value(value):
    """Replace NaN values with None for Elasticsearch compatibility."""
    if isinstance(value, float) and np.isnan(value):
        return None
    return value

def doc_generator(df):
    """Generate documents from a DataFrame for bulk indexing in Elasticsearch."""
    for index, row in df.iterrows():
        doc = {
            "_index": INDEX_NAME,
            "_id": str(clean_value(row["Name"])),  # Można użyć 'Name' jako identyfikator
            "_source": {
                "name": clean_value(row["Name"]),
                "description": clean_value(row["Description"]),
                "url": clean_value(row["URL"]),
                "created_at": clean_value(row["Created At"]),
                "updated_at": clean_value(row["Updated At"]),
                "homepage": clean_value(row["Homepage"]),
                "size": clean_value(row["Size"]),
                "stars": clean_value(row["Stars"]),
                "forks": clean_value(row["Forks"]),
                "issues": clean_value(row["Issues"]),
                "watchers": clean_value(row["Watchers"]),
                "language": clean_value(row["Language"]),
                "license": clean_value(row["License"]),
                "topics": clean_value(row["Topics"]),
                "has_issues": clean_value(row["Has Issues"]),
                "has_projects": clean_value(row["Has Projects"]),
                "has_downloads": clean_value(row["Has Downloads"]),
                "has_wiki": clean_value(row["Has Wiki"]),
                "has_pages": clean_value(row["Has Pages"]),
                "has_discussions": clean_value(row["Has Discussions"]),
                "is_fork": clean_value(row["Is Fork"]),
                "is_archived": clean_value(row["Is Archived"]),
                "is_template": clean_value(row["Is Template"]),
                "default_branch": clean_value(row["Default Branch"]),
            }
        }
        yield doc

try:
    bulk(es, doc_generator(df))
    print("Dane zostały zaindeksowane!")
except BulkIndexError as e:
    print("❌ Błąd podczas indeksowania dokumentów:")
    for error in e.errors:
        print(error)
