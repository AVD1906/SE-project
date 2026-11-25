This website turns one customer request into functional requirements, an SDLC comparison, and a downloadable SRS PDF.
Enter the request once on the Overview page, then review the results on their dedicated pages.

## Folder structure

```text
frontend/
  assets/
  index.html
  requirements.html
  sdlc.html
  srs.html
backend/
  agents/
  experiments/
  pipeline/
  sdlc/
  requirements.txt
config/
data/
  generated/
  processed/
  source_documents/
evaluation/
  benchmark/
tests/
  browser/
  python/
```

## Run the website

From the project root, run:

```powershell
python -m http.server 8000 --directory frontend
```

Then open `http://localhost:8000` in your browser.
