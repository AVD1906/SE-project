from sentence_transformers import SentenceTransformer
import pickle
import numpy as np


# ============================================================
# 1. Load embedding model
# ============================================================

print("Loading embedding model...")

model = SentenceTransformer(
    "sentence-transformers/all-MiniLM-L6-v2"
)


# ============================================================
# 2. Load chunks and embeddings
# ============================================================

with open("embeddings.pkl", "rb") as f:
    data = pickle.load(f)

chunks = data["chunks"]
embeddings = data["embeddings"]


# ============================================================
# 3. Normalize embeddings
# ============================================================

embeddings_normalized = embeddings / np.linalg.norm(
    embeddings,
    axis=1,
    keepdims=True
)


# ============================================================
# 4. Targeted retrieval queries
# ============================================================

queries = [

    "applicant personal information income and financial information required for a loan application",

    "existing current loan flag and special evaluation of a client who already has a current loan",

    "collateral and guarantor requirements for evaluating a loan application",

    "KYC requirements and information used for loan analysis",

    "loan application verification approval and rejection requirements"
]


# ============================================================
# 5. Retrieve top chunks for each query
# ============================================================

all_results = []

for query in queries:

    print("\n" + "=" * 80)
    print("QUERY:")
    print(query)

    # Convert query into embedding
    query_embedding = model.encode(query)

    # Normalize query
    query_embedding = query_embedding / np.linalg.norm(
        query_embedding
    )

    # Cosine similarity
    similarities = np.dot(
        embeddings_normalized,
        query_embedding
    )

    # Top 2 chunks
    top_k = 2

    top_indices = np.argsort(
        similarities
    )[::-1][:top_k]

    for index in top_indices:

        result = {
            "query": query,
            "similarity": similarities[index],
            "chunk": chunks[index]
        }

        all_results.append(result)

        print("\nSimilarity:", round(similarities[index], 4))
        print(chunks[index])


# ============================================================
# 6. Remove duplicate chunks
# ============================================================

unique_results = []
seen_chunks = set()

for result in all_results:

    chunk = result["chunk"]

    if "CHUNK_ID:" not in chunk:
        continue

    chunk_id = (
        chunk.split("CHUNK_ID:")[1]
        .split("\n")[0]
        .strip()
    )

    if chunk_id not in seen_chunks:

        seen_chunks.add(chunk_id)
        unique_results.append(result)


# ============================================================
# 7. Ensure important eligibility evidence is included
# ============================================================

# Chunk 32 contains the existing-loan eligibility evidence.
required_chunk_ids = {"32"}

for chunk in chunks:

    if "CHUNK_ID:" not in chunk:
        continue

    chunk_id = (
        chunk.split("CHUNK_ID:")[1]
        .split("\n")[0]
        .strip()
    )

    if chunk_id in required_chunk_ids:

        if chunk_id not in seen_chunks:

            unique_results.append({
                "query": "Explicit eligibility evidence",
                "similarity": 1.0,
                "chunk": chunk
            })

            seen_chunks.add(chunk_id)


# ============================================================
# 8. Display final evidence
# ============================================================

print("\n")
print("=" * 80)
print("FINAL RETRIEVED EVIDENCE")
print("=" * 80)

for i, result in enumerate(unique_results, start=1):

    print("\n" + "-" * 80)
    print("Evidence", i)
    print("Similarity:", round(result["similarity"], 4))
    print(result["chunk"])


# ============================================================
# 9. Save final evidence for the LLM
# ============================================================

with open(
    "retrieved_context.txt",
    "w",
    encoding="utf-8"
) as f:

    f.write(
        "RETRIEVED EVIDENCE FOR AUTOMATED LOAN ELIGIBILITY ASSESSMENT\n"
    )

    f.write("=" * 80 + "\n\n")

    for i, result in enumerate(unique_results, start=1):

        f.write(
            f"Evidence {i}\n"
        )

        f.write(
            f"Retrieval Query: {result['query']}\n"
        )

        f.write(
            f"Similarity: {result['similarity']:.4f}\n"
        )

        f.write(
            result["chunk"]
        )

        f.write(
            "\n\n" + "=" * 80 + "\n\n"
        )


# ============================================================
# 10. Final message
# ============================================================

print("\n" + "=" * 80)
print("Retrieved evidence saved to retrieved_context.txt")
print("Unique chunks retrieved:", len(unique_results))
print("=" * 80)