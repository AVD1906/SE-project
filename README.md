# Fieldnote · Software Engineering course project

Two focused software engineering agents support an early project workflow:

1. **Requirements agent** turns a customer scenario into source-linked software requirements.
2. **SDLC advisor** compares project characteristics with lifecycle selection rules and explains the best fit.

The included walkthrough uses the digital lending scenario already present in the source material.

## Run the interface

From the project root, run:

```powershell
python -m http.server 8000 --directory web
```

Open `http://localhost:8000`. Start on the overview page and enter the customer request once. The browser maps it to the included source-backed requirement catalogue, derives project signals for an SDLC fit, and prepares an SRS. The SRS page imports the workflow results and downloads a PDF directly. The separate agent pages remain available for inspection.

## Project layout

```text
web/                         Browser UI and agent demo pages
  index.html                 Project overview and workflow entry point
  requirements.html          Agent 01: requirements drafting and traceability
  sdlc.html                  Agent 02: lifecycle comparison and recommendation
  srs.html                   Separate IEEE 830 SRS builder and download page
  assets/                    Shared styling and page interactions
presentation/                Course evaluation slides and deck builder
docs/                        Project notes and walkthrough guide
info for req docs/           Original PDF source documents
extracted_docs/              Extracted source text
*.py                         Original retrieval, generation, and SDLC scripts
*.txt / *.json / *.pkl        Existing working data and agent outputs
```

The existing command-line AI pipeline remains in the root scripts. It uses a local retrieval stage and Gemini for requirement generation / project characteristic extraction. The browser workflow uses the project’s bundled source-backed catalogue and rule-based SDLC scoring; it does not make live Gemini or internet calls. Unsupported details stay visible for review rather than being invented.

The SRS builder follows the IEEE 830-1998 outline shown in the user-provided `Block-1.pdf`. It creates a self-contained PDF and includes the requirements and SDLC prediction prepared from the single workflow request. Unspecified fields are explicitly marked for stakeholder input. Optional document details can be reviewed or edited before export.

## Evaluate the browser agent logic

```powershell
node scripts/test_agent_logic.js
```

The focused checks cover scenario classification, source-trace safeguards, all seven SDLC models, unknown and tied evidence, and page event handlers. A draft benchmark and review protocol are in `benchmark/`; see its README before interpreting baseline metrics.

## Presentation

Open [SE_Project_Evaluation.pptx](presentation/SE_Project_Evaluation.pptx) for the evaluation walkthrough. To rebuild it with Python's standard library:

```powershell
python presentation/make_deck.py
```

