import os
from pathlib import Path
from google import genai

ROOT = Path(__file__).resolve().parents[2]



api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY is not set.")

client = genai.Client(api_key=api_key)




print("=" * 80)
print("FINANCIAL REQUIREMENT GATHERING ASSISTANT")
print("=" * 80)

customer_input = input(
    "\nEnter the customer's requirement:\n> "
)




with (ROOT / "data" / "generated" / "retrieved_context.txt").open(
    "r",
    encoding="utf-8"
) as f:
    context = f.read()




generation_prompt = f"""
You are a financial requirements engineering assistant.

CUSTOMER STATEMENT:
{customer_input}

SOURCE EVIDENCE:
{context}


TASK
----

Understand the customer's statement and generate software
requirements by combining:

1. The customer's requested functionality
2. Relevant information explicitly supported by the
   SOURCE EVIDENCE


IMPORTANT TRACEABILITY PRINCIPLE
--------------------------------

A generated requirement may contain information that was
not explicitly stated by the customer IF that information
is explicitly supported by the SOURCE EVIDENCE.

Therefore distinguish between:

- Customer intent
- Source-supported details
- Generated requirement


GROUNDING RULES
---------------

1. Use only information from the customer statement and
   SOURCE EVIDENCE.

2. Do NOT use general banking knowledge.

3. Do NOT invent requirements.

4. Do NOT invent regulations.

5. Do NOT invent credit-score rules.

6. Do NOT invent financial thresholds.

7. Do NOT invent security controls.

8. Do NOT invent technology.

9. Do NOT invent acceptance criteria.

10. Every requirement MUST have a source CHUNK_ID.

11. Preserve the customer's intended functionality.

12. Source-supported details may be included even if the
    customer did not explicitly mention them.

13. If information is unavailable, write:

"Not explicitly supported by provided evidence."

14. If a customer request cannot be supported by the
    retrieved evidence, put it under UNSUPPORTED REQUESTS.

15. If important information is ambiguous or incomplete,
    ask a clarification question instead of guessing.


CATEGORIES
----------

Business
Stakeholder
Functional
Security
Privacy
Regulatory
Performance
Availability/Reliability
Usability
Data Management
Integration
Audit/Reporting
Operational/Maintenance


OUTPUT FORMAT
-------------

CUSTOMER STATEMENT:

CS-001:
<Customer's original statement>


CUSTOMER UNDERSTANDING:

<Brief explanation>


SUPPORTED REQUIREMENTS:


R1:

Requirement ID:
R1

Customer Statement ID:
CS-001

Requirement Statement:
...

Category:
...

Source Document:
...

Source Chunk:
...

Business Justification:
...

Priority:
...

Dependencies:
...

Assumptions:
...

Acceptance Criteria:
...

Applicable Regulations:
...

Risk Level:
...

Confidence Score:
...

Approval Status:
Pending Human Approval


[Repeat for R2, R3, etc.]


CLARIFICATION QUESTIONS:

Q1:
...

If none:
No clarification required.


UNSUPPORTED REQUESTS:

...

If none:
None.


TRACEABILITY SUMMARY:

CS-001 → R1 → CHUNK_ID: ...
CS-001 → R2 → CHUNK_ID: ...


FINAL RULE:

Do not fill missing information using your own knowledge.
"""


# --------------------------------------------------
# GENERATE REQUIREMENTS
# --------------------------------------------------

print("\nGenerating requirements...\n")

generation_response = client.models.generate_content(
    model="gemini-3.5-flash-lite",
    contents=generation_prompt
)

requirements = generation_response.text




quality_prompt = f"""
You are a software requirements quality analyst.

Analyze the generated requirements using BOTH:

1. CUSTOMER STATEMENT
2. SOURCE EVIDENCE

Do NOT judge a requirement only by whether it appears
in the customer statement.


CUSTOMER STATEMENT:
{customer_input}


SOURCE EVIDENCE:
{context}


GENERATED REQUIREMENTS:
{requirements}


TASK
----

Analyze EVERY generated requirement.


CHECK THE FOLLOWING
-------------------

1. CUSTOMER SUPPORT

Determine whether the requirement is:

Direct:
The customer explicitly requested this.

Partial:
The customer requested the general functionality but
the requirement adds source-supported details.

Not stated:
The customer did not request this functionality.


2. SOURCE EVIDENCE SUPPORT

Determine whether the requirement is:

Direct:
The source explicitly supports the requirement.

Partial:
The source supports the general idea but not every detail.

Not supported:
The source does not support the requirement.


3. TRACEABILITY

Check whether the requirement has:

- Source document
- Source chunk
- Customer Statement ID


4. AMBIGUITY

Check whether important terms or behavior are unclear.

Do NOT call something ambiguous merely because it is not
written in the customer statement if the source evidence
clearly defines or supports it.


5. COMPLETENESS

Check whether the requirement contains enough information
to express the functionality supported by the evidence.

Do NOT invent missing details.


6. CONSISTENCY

Check for conflicts with:

- Customer statement
- Other generated requirements
- Source evidence


7. DUPLICATION

Check whether the requirement duplicates another generated
requirement.


8. UNDEFINED TERMINOLOGY

Check whether important terminology is unexplained or
unsupported by both the customer statement and source
evidence.


9. TESTABILITY

Determine whether the requirement can reasonably be tested
using only the information available.

Do NOT invent acceptance criteria.


10. SECURITY / COMPLIANCE

Determine whether security or compliance information is:

Present
Missing
Not applicable

A missing security/compliance field is NOT automatically an
error when the provided evidence contains no such
information.


11. UNSUPPORTED INFORMATION

Identify details that are not supported by either:

- Customer statement
- Source evidence


IMPORTANT
---------

Do NOT treat information as unsupported merely because it
was not stated by the customer.

For example:

Customer:
"Check whether the applicant has an existing loan."

Source:
"Flag clients who have a current loan for special
evaluation by the Credit Officer."

Generated:
"The application shall flag clients who have a current
loan for special evaluation by the Credit Officer."

This is:

Customer Support: Partial
Evidence Support: Direct

It is NOT an unsupported requirement.


Also:

Do NOT treat words such as "should" versus "must" as a
quality defect unless the source evidence explicitly
requires a particular wording standard.

Do NOT invent quality rules.


OUTPUT FORMAT
-------------

==================================================
REQUIREMENT QUALITY ANALYSIS
==================================================


R1:

Requirement:
<requirement statement>


Customer Support:
<Direct / Partial / Not stated>

Customer Support Details:
<explanation>


Source Evidence Support:
<Direct / Partial / Not supported>

Source Evidence Details:
<explanation>


Traceability:
<Present / Missing>

Traceability Details:
<explanation>


Ambiguity:
<Yes / No>

Ambiguity Details:
<explanation>


Completeness:
<Complete / Incomplete>

Completeness Details:
<explanation>


Consistency:
<Consistent / Inconsistent>

Consistency Details:
<explanation>


Duplication:
<Yes / No>

Duplication Details:
<explanation>


Undefined Terminology:
<Yes / No>

Terminology Details:
<explanation>


Testability:
<Testable / Not clearly testable>

Testability Details:
<explanation>


Security/Compliance:
<Present / Missing / Not applicable>

Security/Compliance Details:
<explanation>


Unsupported Information:
<Yes / No>

Unsupported Information Details:
<explanation>


Overall Quality Issues:
<List only actual issues>


[Repeat for R2, R3, etc.]


==================================================
QUALITY SUMMARY
==================================================

Total Requirements:
<number>

Requirements With Issues:
<number>

Requirements Without Issues:
<number>


CUSTOMER VS SOURCE ANALYSIS:

<Brief explanation of where requirements directly reflect
customer requests and where source evidence adds additional
domain-specific details.>


Main Issues Found:
<list>


==================================================
RECOMMENDED CLARIFICATIONS
==================================================

Q1:
<question>

Q2:
<question>

If none:
No additional clarification required.


IMPORTANT FINAL RULE:

Do not rewrite or silently modify the requirements.

Do not invent missing requirements.

Do not treat source-supported details as unsupported merely
because they were not explicitly stated by the customer.
"""




print("\nChecking requirement quality...\n")

quality_response = client.models.generate_content(
    model="gemini-3.5-flash-lite",
    contents=quality_prompt
)

quality_analysis = quality_response.text




print("\n")
print("=" * 80)
print("GENERATED REQUIREMENTS")
print("=" * 80)

print(requirements)

print("\n")
print("=" * 80)
print("REQUIREMENT QUALITY ANALYSIS")
print("=" * 80)

print(quality_analysis)

print("=" * 80)




with (ROOT / "data" / "generated" / "generated_requirements.txt").open(
    "w",
    encoding="utf-8"
) as f:

    f.write("=" * 80 + "\n")
    f.write("CUSTOMER REQUIREMENT\n")
    f.write("=" * 80 + "\n\n")

    f.write(customer_input)

    f.write("\n\n")
    f.write("=" * 80 + "\n")
    f.write("GENERATED REQUIREMENTS\n")
    f.write("=" * 80 + "\n\n")

    f.write(requirements)

    f.write("\n\n")
    f.write("=" * 80 + "\n")
    f.write("REQUIREMENT QUALITY ANALYSIS\n")
    f.write("=" * 80 + "\n\n")

    f.write(quality_analysis)


print("\nSaved to data/generated/generated_requirements.txt")
