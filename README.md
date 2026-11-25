This website turns one customer request into functional requirements, an SDLC comparison, and a downloadable SRS PDF.
Enter the request once on the Overview page, then review the results on their dedicated pages.

## Folder structure

```text
.
├── backend
│   ├── agents
│   │   ├── rag_generate.py
│   │   ├── rag_generate_local.py
│   │   └── sdlc_analyzer.py
│   ├── experiments
│   │   ├── download_model.py
│   │   └── generate_test.py
│   ├── pipeline
│   │   ├── chunk_docs.py
│   │   ├── create_embeddings.py
│   │   ├── extract_docs.py
│   │   └── retrieve.py
│   ├── sdlc
│   │   └── sdlc_rules_engine.py
│   └── requirements.txt
├── config
│   └── sdlc_rules.txt
├── data
│   ├── generated
│   │   ├── clarification_questions.json
│   │   ├── generated_requirements.txt
│   │   ├── project_characteristics.json
│   │   └── retrieved_context.txt
│   ├── processed
│   │   ├── extracted_text
│   │   │   ├── 00_EDF_Loan_Management_SRS.txt
│   │   │   ├── 01_RBI_Fair_Practices_Lenders.txt
│   │   │   ├── 02_RBI_Digital_Lending.txt
│   │   │   ├── 03_RBI_Regulations_Handbook.txt
│   │   │   ├── 04_RBI_IT_Outsourcing.txt
│   │   │   ├── 05_FFIEC_Authentication.txt
│   │   ├── chunks.txt
│   │   └── embeddings.pkl
│   └── source_documents
│       └── pdfs
│           ├── 00_EDF_Loan_Management_SRS.pdf
│           ├── 01_RBI_Fair_Practices_Lenders.pdf
│           ├── 02_RBI_Digital_Lending.pdf
│           ├── 03_RBI_Regulations_Handbook.pdf
│           ├── 04_RBI_IT_Outsourcing.pdf
│           └── 05_FFIEC_Authentication.pdf
├── evaluation
│   └── benchmark
│       └── benchmark.json
├── frontend
│   ├── assets
│   │   ├── agent-core.js
│   │   ├── app.css
│   │   ├── requirements.js
│   │   ├── sdlc.js
│   │   ├── srs.js
│   │   └── workflow.js
│   ├── index.html
│   ├── requirements.html
│   ├── sdlc.html
│   └── srs.html
├── tests
│   ├── browser
│   │   ├── run_agent_benchmark.js
│   │   └── test_agent_logic.js
│   └── python
│       ├── test_05b.py
│       ├── test_embeddings.py
│       ├── test_gemini.py
│       ├── test_hf.py
│       ├── test_model.py
│       └── test_smollm.py
└── README.md
```

## Run the website

From the project root, run:

```powershell
python -m http.server 8000 --directory frontend
```

Then open `http://localhost:8000` in your browser.
