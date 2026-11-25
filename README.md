This website turns one customer request into functional requirements, an SDLC comparison, and a downloadable SRS PDF.
Enter the request once on the Overview page, then review the results on their dedicated pages.

## Folder structure

```text
.
├── backend
│   ├── agents
│   ├── experiments
│   ├── pipeline
│   └── sdlc
├── config
├── data
│   ├── generated
│   ├── processed
│   │   └── extracted_text
│   └── source_documents
│       └── pdfs
├── evaluation
│   └── benchmark
├── frontend
│   └── assets
└── tests
    ├── browser
    └── python
```

## Run the website

From the project root, run:

```powershell
python -m http.server 8000 --directory frontend
```

Then open `http://localhost:8000` in your browser.
