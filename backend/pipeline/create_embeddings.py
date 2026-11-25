from sentence_transformers import SentenceTransformer
from pathlib import Path
import pickle

print("Loading embedding model...")

ROOT = Path(__file__).resolve().parents[2]
model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")


text = (ROOT / "data" / "processed" / "chunks.txt").read_text(encoding="utf-8")


raw_chunks = text.split("-" * 80)

chunks = []

for chunk in raw_chunks:
    chunk = chunk.strip()

    if chunk:
        chunks.append(chunk)

print(f"Found {len(chunks)} chunks")


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


data = {
    "chunks": chunks,
    "texts": texts,
    "embeddings": embeddings
}

embedding_file = ROOT / "data" / "processed" / "embeddings.pkl"
with embedding_file.open("wb") as f:
    pickle.dump(data, f)

print("\nEmbeddings created successfully!")
print("Number of embeddings:", len(embeddings))
print("Vector size:", len(embeddings[0]))
print(f"Saved to: {embedding_file.relative_to(ROOT)}")
