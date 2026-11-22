## Software Engineering course project

This demonstrates a single-input project workflow with a requirements agent, an SDLC advisor, and an SRS PDF builder.

## Run the browser app

From the project root:

```powershell
python -m http.server 8000 --directory frontend
```

Open `http://localhost:8000`. Enter a customer request once on the overview page. The browser app prepares source-linked requirements, an SDLC comparison, and an SRS that can be downloaded as a PDF. This demo uses bundled rules and source material; it does not call a live AI service.

## Project layout

```text
frontend/                     Browser app and its page assets
src/
  agents/                     Requirement generation and SDLC analysis prototypes
  pipeline/                   PDF extraction, chunking, embeddings, retrieval
  sdlc/                       Standalone SDLC rules engine
  experiments/                Model download and generation experiments
data/
  source_documents/pdfs/      Original reference documents
  processed/                  Extracted text, chunks, and embeddings
  generated/                  Retrieval and model output files
config/                       SDLC selection rules
tests/
  browser/                    Browser logic checks and benchmark runner
  python/                     Python and model experiments
evaluation/benchmark/         Benchmark cases and interpretation guide
docs/                         Demo instructions and project notes
presentation/                 Course evaluation slides and deck builder
```

## Check the browser logic

```powershell
node tests/browser/test_agent_logic.js
node tests/browser/run_agent_benchmark.js
```

The Python scripts under `src/` are the original retrieval and model prototypes. They may require additional Python packages, downloaded models, and API credentials. Their file paths are resolved relative to the project, so run them from any working directory using the paths below.

## Optional Python pipeline

Run the stages in order:

```powershell
python src/pipeline/extract_docs.py
python src/pipeline/chunk_docs.py
python src/pipeline/create_embeddings.py
python src/pipeline/retrieve.py
python src/agents/rag_generate_local.py
python src/agents/sdlc_analyzer.py
```

The generation scripts require the corresponding API key in the environment. Keep credentials in environment variables; do not commit them.

## Presentation

Open `presentation/SE_Project_Evaluation.pptx` for the course walkthrough. Rebuild it with:

```powershell
python presentation/make_deck.py
```
