import os
from google import genai

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY is not set.")

client = genai.Client(api_key=api_key)

prompt = """
You are a requirements engineering assistant.

For a loan processing system, generate 3 simple
functional requirements for automated loan eligibility assessment.

Keep them concise and structured.
"""

response = client.models.generate_content(
    model="gemini-3.5-flash-lite",
    contents=prompt
)

print("=" * 80)
print("GEMINI RESPONSE")
print("=" * 80)
print(response.text)
print("=" * 80)