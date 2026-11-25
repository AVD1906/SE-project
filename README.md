# Software Engineering course project

This project demonstrates a single-input workflow with a requirements agent, an SDLC advisor, and an SRS PDF builder.

## Run the browser app

From the project root:

```powershell
python -m http.server 8000 --directory frontend
```

Open `http://localhost:8000`. Enter a customer request on the overview page. The browser prepares source-matched requirements, an SDLC comparison, and an SRS PDF using its bundled catalogue and rules. The browser workflow runs locally and does not call a live AI service.

## Project layout

```text
frontend/                     Browser app and page assets
backend/
  agents/                     Gemini and OpenAI command-line prototypes
  pipeline/                   PDF extraction, chunking, embeddings, retrieval
  sdlc/                       Standalone Python SDLC rules engine
  experiments/                Model download/generation experiments
  requirements.txt            Python packages for the fallback pipeline
data/
  source_documents/pdfs/      Original reference documents
  processed/                  Extracted text, chunks, and embeddings
  generated/                  Retrieval and model output files
config/                       SDLC selection rules
tests/                        Browser checks and Python experiments
evaluation/benchmark/          Benchmark cases and review notes
docs/                         Demo instructions and project notes
presentation/                 Course slides and deck builder
```

## Check the browser app

```powershell
node tests/browser/test_agent_logic.js
node tests/browser/run_agent_benchmark.js
```

## Optional Python fallback

The Python retrieval and generation pipeline is kept under `backend/` as a separate fallback. It is not called automatically by the browser app. See [backend/README.md](backend/README.md) for setup and run order. The pipeline may download a sentence embedding model and needs API credentials for Gemini or OpenAI stages.

## Presentation

Open `presentation/SE_Project_Evaluation.pptx` for the course walkthrough. Rebuild it with:

```powershell
python presentation/make_deck.py
```
