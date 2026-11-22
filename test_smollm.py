from transformers import AutoTokenizer, AutoModelForCausalLM
import torch

MODEL_NAME = "HuggingFaceTB/SmolLM2-1.7B-Instruct"

print("Loading model...")

tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)

model = AutoModelForCausalLM.from_pretrained(
    MODEL_NAME,
    dtype=torch.float16
)

print("Model loaded!")

prompt = """
Explain what a loan eligibility assessment system does.
Give 3 simple points.
"""

messages = [
    {
        "role": "user",
        "content": prompt
    }
]

text = tokenizer.apply_chat_template(
    messages,
    tokenize=False,
    add_generation_prompt=True
)

inputs = tokenizer(
    text,
    return_tensors="pt"
)

print("\nGenerating...\n")

with torch.no_grad():
    outputs = model.generate(
        **inputs,
        max_new_tokens=100,
        do_sample=False,
        pad_token_id=tokenizer.eos_token_id
    )

generated_tokens = outputs[0][inputs["input_ids"].shape[1]:]

response = tokenizer.decode(
    generated_tokens,
    skip_special_tokens=True
)

print("=" * 60)
print("MODEL RESPONSE")
print("=" * 60)
print(response)
print("=" * 60)