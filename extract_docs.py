from pathlib import Path
from pypdf import PdfReader

input_folder = Path("info for req docs")
output_folder = Path("extracted_docs")

output_folder.mkdir(exist_ok=True)

for pdf_file in input_folder.glob("*.pdf"):

    print(f"Extracting: {pdf_file.name}")

    reader = PdfReader(pdf_file)

    text = ""

    for page in reader.pages:
        page_text = page.extract_text()

        if page_text:
            text += page_text + "\n"

    output_file = output_folder / (pdf_file.stem + ".txt")

    output_file.write_text(text, encoding="utf-8")

    print(f"Saved: {output_file}")
    print(f"Characters: {len(text)}")
    print()

print("All documents extracted!")