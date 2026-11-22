from transformers import AutoTokenizer, AutoModelForCausalLM

model_name = "Qwen/Qwen2.5-1.5B-Instruct"

tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(model_name)

loan_context = """
The loan management system should support:
- Online loan applications
- Recording loan application, vetting, verification and approval details
- Credit scoring and pricing
- Capturing KYC requirements
- Collateral and guarantor registration
- Audit trails with timestamps and access control
- Secure and reliable loan processing
"""

prompt = f"""
You are a software requirements engineer working on a financial-sector
loan processing system.

Based ONLY on the following domain information:

{loan_context}

Generate requirements for the functionality:
"Automated Loan Eligibility Assessment"

Generate 5 requirements.

For each requirement provide:
1. Requirement ID
2. Requirement statement
3. Category
4. Business justification
5. Dependencies
6. Acceptance criteria
7. Risk level
8. Confidence score

Do not invent regulations or facts that are not present in the provided context.
"""

messages = [
    {"role": "user", "content": prompt}
]

text = tokenizer.apply_chat_template(
    messages,
    tokenize=False,
    add_generation_prompt=True
)

inputs = tokenizer(text, return_tensors="pt")

print("Generating requirements...\n")

outputs = model.generate(
    **inputs,
    max_new_tokens=800,
    do_sample=False
)

response = tokenizer.decode(
    outputs[0][inputs["input_ids"].shape[1]:],
    skip_special_tokens=True
)

print(response)