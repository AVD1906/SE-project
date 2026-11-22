from sentence_transformers import SentenceTransformer

model_name = "sentence-transformers/all-MiniLM-L6-v2"

print("Loading embedding model...")

model = SentenceTransformer(model_name)

text = "The system should flag clients who have a current loan for special evaluation by the Credit Officer."

embedding = model.encode(text)

print("Embedding created!")
print("Vector size:", len(embedding))
print("First 10 values:", embedding[:10])