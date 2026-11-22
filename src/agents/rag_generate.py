from openai import OpenAI
import os
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]

# -----------------------------
# 1. Connect to OpenAI
# -----------------------------

client = OpenAI(
    api_key=os.environ["OPENAI_API_KEY"]
)

print("Connected to online LLM!")


# -----------------------------
# 2. Load retrieved RAG context
# -----------------------------

with (ROOT / "data" / "generated" / "retrieved_context.txt").open("r", encoding="utf-8") as f:
    context = f.read()


# -----------------------------
# 3. Create prompt
# -----------------------------

prompt = f"""
You are a requirements engineering assistant for a loan processing system.

Generate requirements for:

Automated Loan Eligibility Assessment

Use ONLY the SOURCE EVIDENCE provided below.

Rules:
- Do not invent requirements.
- Do not introduce technologies not supported by the evidence.
- Do not introduce regulations not supported by the evidence.
- Do not introduce machine learning unless explicitly supported.
- Do not introduce fraud detection unless explicitly supported.
- Every requirement must be traceable to the evidence.

Generate 5 requirements.

For each requirement provide:

1. Requirement ID
2. Requirement Statement
3. Category
4. Business Justification
5. Source Evidence
6. Dependencies
7. Acceptance Criteria
8. Risk Level
9. Confidence Score

SOURCE EVIDENCE:
{context}
"""


# -----------------------------
# 4. Send to online LLM
# -----------------------------

print("Generating requirements...\n")

response = client.responses.create(
    model="gpt-5.6-luna",
    input=prompt
)


# -----------------------------
# 5. Display result
# -----------------------------

result = response.output_text

print("=" * 80)
print("GENERATED REQUIREMENTS")
print("=" * 80)

print(result)


# -----------------------------
# 6. Save result
# -----------------------------

with (ROOT / "data" / "generated" / "generated_requirements.txt").open("w", encoding="utf-8") as f:
    f.write(result)

print("\nRequirements saved to data/generated/generated_requirements.txt")
