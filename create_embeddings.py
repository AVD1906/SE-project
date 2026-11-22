from sentence_transformers import SentenceTransformer
from pathlib import Path
import pickle

print("Loading embedding model...")

model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

# Read chunks
text = Path("chunks.txt").read_text(encoding="utf-8")

# Split individual chunks
raw_chunks = text.split("-" * 80)

chunks = []

for chunk in raw_chunks:
    chunk = chunk.strip()

    if chunk:
        chunks.append(chunk)

print(f"Found {len(chunks)} chunks")

# Extract only the actual text
texts = []

for chunk in chunks:
    if "TEXT:" in chunk:
        text_part = chunk.split("TEXT:", 1)[1]
        texts.append(text_part.strip())

print("Creating embeddings...")

embeddings = model.encode(
    texts,
    show_progress_bar=True
)

# Save everything
data = {
    "chunks": chunks,
    "texts": texts,
    "embeddings": embeddings
}

with open("embeddings.pkl", "wb") as f:
    pickle.dump(data, f)

print("\nEmbeddings created successfully!")
print("Number of embeddings:", len(embeddings))
print("Vector size:", len(embeddings[0]))
print("Saved to: embeddings.pkl")