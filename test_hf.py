import requests

url = "https://huggingface.co/Qwen/Qwen2.5-1.5B-Instruct/resolve/main/model.safetensors"

r = requests.get(url, stream=True, timeout=20)

print("Status:", r.status_code)
print("Final URL:", r.url)
print("Content-Length:", r.headers.get("content-length"))