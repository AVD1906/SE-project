from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
input_folder = ROOT / "data" / "processed" / "extracted_text"
output_file = ROOT / "data" / "processed" / "chunks.txt"

CHUNK_SIZE = 600
OVERLAP = 100

chunks = []
chunk_id = 0

for file in input_folder.glob("*.txt"):

    text = file.read_text(encoding="utf-8")

    # Clean whitespace
    text = " ".join(text.split())

    start = 0

    while start < len(text):

        end = start + CHUNK_SIZE
        chunk_text = text[start:end].strip()

        if chunk_text:
            chunks.append(
                f"CHUNK_ID: {chunk_id}\n"
                f"SOURCE: {file.name}\n"
                f"TEXT: {chunk_text}\n"
                f"{'-' * 80}"
            )

            chunk_id += 1

        start += CHUNK_SIZE - OVERLAP

output_file.write_text(
    "\n".join(chunks),
    encoding="utf-8"
)

print(f"Created {len(chunks)} chunks")
print(f"Saved to: {output_file}")
