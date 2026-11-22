# Single-input project workflow

## Run

- From the project root, run `python -m http.server 8000 --directory frontend`.
- Open `http://localhost:8000`.

## Walkthrough

1. Enter the customer requirement once on the overview page.
2. Select **Analyze and prepare SRS**. The requirements matcher and SDLC advisor run from that same input.
3. Review source-matched requirement candidates and their source chunks. Anything unmatched stays marked for stakeholder review.
4. Review the provisional or rule-supported SDLC fit and the characteristics that remain unknown.
5. Select **Open generated SRS & download PDF**. The IEEE 830-1998 SRS page is prefilled from the workflow. Optional document details may be edited; no second requirements entry is needed.
6. Select **Download SRS · PDF** to save the document directly.

## Evidence boundaries

The browser workflow uses the project’s embedded excerpts from the EDF Loan Management SRS and the existing SDLC selection rules. It is self-contained and does not call Gemini or fetch live internet data. The requirement matcher only emits source-backed catalogue items; unmatched requests are listed for review. SDLC predictions are rule-based and provisional when project characteristics are unknown. The command-line Gemini and retrieval prototypes remain separate.
