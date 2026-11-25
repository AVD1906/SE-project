from google import genai
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]


# =========================================================
# 1. READ INPUT FILES
# =========================================================

with (ROOT / "data" / "generated" / "generated_requirements.txt").open("r", encoding="utf-8") as f:
    requirements = f.read()

with (ROOT / "config" / "sdlc_rules.txt").open("r", encoding="utf-8") as f:
    rules = f.read()


# =========================================================
# 2. CONNECT TO GEMINI
# =========================================================

client = genai.Client()


# =========================================================
# 3. EXTRACT PROJECT CHARACTERISTICS
# =========================================================

prompt = f"""
You are extracting project characteristics for an SDLC
selection system.

IMPORTANT:
Do NOT select an SDLC model.

Use the generated requirements below.

{requirements}

Extract exactly these characteristics:

1. requirement_stability
2. requirement_uncertainty
3. requirement_change
4. functional_complexity
5. project_complexity
6. risk
7. user_involvement
8. need_prototype
9. formal_vv
10. short_timeline
11. modular_system
12. early_working_system
13. frequent_releases

Only use information supported by the requirements.

If the requirements do not provide enough information,
return "Unknown".

Return ONLY valid JSON.

Example:

{{
    "requirement_stability": "Unknown",
    "requirement_uncertainty": "Low",
    "requirement_change": "Unknown",
    "functional_complexity": "Low",
    "project_complexity": "Low",
    "risk": "Unknown",
    "user_involvement": "Unknown",
    "need_prototype": "Unknown",
    "formal_vv": "Unknown",
    "short_timeline": "Unknown",
    "modular_system": "Unknown",
    "early_working_system": "Unknown",
    "frequent_releases": "Unknown"
}}
"""


response = client.models.generate_content(
    model="gemini-3.5-flash-lite",
    contents=prompt
)

text = response.text.strip()


# Remove markdown JSON fences if Gemini adds them
if text.startswith("```json"):
    text = text[7:]

if text.startswith("```"):
    text = text[3:]

if text.endswith("```"):
    text = text[:-3]

text = text.strip()


try:
    project = json.loads(text)

except json.JSONDecodeError:
    print("\nERROR: Gemini did not return valid JSON.")
    print(text)
    exit()


# =========================================================
# 4. SAVE CHARACTERISTICS
# =========================================================

with (ROOT / "data" / "generated" / "project_characteristics.json").open("w", encoding="utf-8") as f:
    json.dump(project, f, indent=4)


# =========================================================
# 5. DISPLAY CHARACTERISTICS
# =========================================================

print("\n========== PROJECT CHARACTERISTICS ==========\n")

for key, value in project.items():
    print(f"{key}: {value}")


# =========================================================
# 6. FIND UNKNOWN FACTORS
# =========================================================

unknowns = []

for key, value in project.items():

    if str(value).lower() == "unknown":
        unknowns.append(key)


# =========================================================
# 7. GENERATE CLARIFICATION QUESTIONS
# =========================================================

if unknowns:

    unknown_text = "\n".join(
        f"- {item}" for item in unknowns
    )

    question_prompt = f"""
You are helping determine which SDLC model is appropriate.

The following project characteristics are currently unknown:

{unknown_text}

Create ONE simple clarification question for each
unknown characteristic.

The questions will be answered by the project stakeholder.

Use simple Yes/No questions whenever possible.

For characteristics where Yes/No is not appropriate,
give a small set of meaningful choices.

Do NOT recommend an SDLC.

Return ONLY valid JSON in this format:

{{
    "questions": [
        {{
            "characteristic": "requirement_change",
            "question": "Are requirements expected to change frequently?"
        }}
    ]
}}
"""

    question_response = client.models.generate_content(
        model="gemini-3.5-flash-lite",
        contents=question_prompt
    )

    question_text = question_response.text.strip()

    if question_text.startswith("```json"):
        question_text = question_text[7:]

    if question_text.startswith("```"):
        question_text = question_text[3:]

    if question_text.endswith("```"):
        question_text = question_text[:-3]

    question_text = question_text.strip()

    try:
        question_data = json.loads(question_text)

    except json.JSONDecodeError:
        print("\nERROR: Could not parse clarification questions.")
        print(question_text)
        exit()


    # =====================================================
    # 8. DISPLAY QUESTIONS
    # =====================================================

    print("\n========== INFORMATION REQUIRED ==========\n")

    for i, item in enumerate(question_data["questions"], 1):

        print(f"{i}. {item['question']}")


    # Save questions
    with (ROOT / "data" / "generated" / "clarification_questions.json").open(
        "w",
        encoding="utf-8"
    ) as f:

        json.dump(question_data, f, indent=4)


else:

    print("\n========== NO INFORMATION GAPS ==========\n")
    print("All required characteristics are known.")
