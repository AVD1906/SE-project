# Optional Python backend fallback

This folder holds the retrieval-augmented and LLM-based prototype as a backup to the browser's bundled rule-based workflow. It is intentionally separate from the current frontend: the browser does not call these scripts automatically.

## Pipeline

```text
PDF source documents
  -> extract_docs.py       Extract PDF text
  -> chunk_docs.py         Split text into overlapping passages
  -> create_embeddings.py  Encode passages with Sentence Transformers
  -> retrieve.py           Retrieve evidence passages by cosine similarity
  -> rag_generate_local.py Ask Gemini to draft and quality-check requirements
  -> sdlc_analyzer.py      Ask Gemini to infer project characteristics and clarification questions
```

`sdlc_rules_engine.py` is a separate example of yes/no/unknown rule evaluation. It is not automatically invoked by `sdlc_analyzer.py` or by the browser's SDLC advisor.

## Setup

From the project root, install the optional packages:

```powershell
python -m pip install -r backend/requirements.txt
```

Set `GEMINI_API_KEY` in the environment before using the Gemini stages. `rag_generate.py` is an alternate OpenAI-based generator and requires `OPENAI_API_KEY`.

## Run stages

Run from the project root in this order:

```powershell
python backend/pipeline/extract_docs.py
python backend/pipeline/chunk_docs.py
python backend/pipeline/create_embeddings.py
python backend/pipeline/retrieve.py
python backend/agents/rag_generate_local.py
python backend/agents/sdlc_analyzer.py
```

The embedding and retrieval stages may take time on first run because they load a sentence-transformer model. Outputs are written under `data/processed/` and `data/generated/`.
