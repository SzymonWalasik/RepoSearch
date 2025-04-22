import pandas as pd
import numpy as np
import time
import json
import os
from elasticsearch import Elasticsearch
from elasticsearch.helpers import bulk

DATA_PATH = "../data/repositories.csv"
INDEX_NAME_BASE = "repositories"
PERCENTS = [10, 20, 50, 75, 100]

es = Elasticsearch("http://localhost:9200")

def clean_value(value):
    if isinstance(value, float) and np.isnan(value):
        return None
    return value

def doc_generator(df, index_name):
    for _, row in df.iterrows():
        yield {
            "_index": index_name,
            "_id": str(clean_value(row["Name"])),
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

def get_index_size(index_name):
    stats = es.indices.stats(index=index_name)
    size_in_bytes = stats['_all']['total']['store']['size_in_bytes']
    size_mb = round(size_in_bytes / (1024 * 1024), 2)
    return size_mb

# Load data
df = pd.read_csv(DATA_PATH)
results = []

for percent in PERCENTS:
    subset_size = int(len(df) * (percent / 100))
    subset_df = df.iloc[:subset_size]

    index_name = f"{INDEX_NAME_BASE}-{percent}"
    if es.indices.exists(index=index_name):
        es.indices.delete(index=index_name)

    print(f"➡️  Indexing {percent}% data... ({subset_size} records)")
    start_time = time.time()
    bulk(es, doc_generator(subset_df, index_name))
    end_time = time.time()

    index_size = get_index_size(index_name)
    duration = round(end_time - start_time, 3)

    print(f"✅ {percent}% done in {duration}s, index size: {index_size} MB")

    results.append((percent, duration, index_size))

# Print final results
print("\n📊 Summary:")
print("Procent | Czas (s) | Rozmiar (MB)")
for percent, duration, size in results:
    print(f"{percent}%\t| {duration}s\t| {size} MB")
