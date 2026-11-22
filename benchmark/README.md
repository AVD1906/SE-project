# Agent benchmark v1

This directory contains a **draft development benchmark**, not a reviewed accuracy test set. The labels still need review by the course instructor or a software engineering peer. Do not report the baseline as the system's accuracy.

## Contents

- `benchmark.json`: 26 requirement scenarios and 14 SDLC characteristic sets. Source-backed requirement labels cite chunks in `chunks.txt`; unsupported scenarios are intentionally marked for source-set verification. SDLC labels are derived from `sdlc_rules.txt`, and tied or under-specified examples expect abstention.
- `../scripts/run_agent_benchmark.js`: reports requirement exact-set match, precision, recall, F1, and SDLC agreement, coverage, and abstentions.
- `../scripts/test_agent_logic.js`: focused implementation regression checks.

All cases are currently development examples because the agent logic was inspected and adjusted while preparing this set. Once a reviewer approves or corrects the labels, freeze this file. Build a new, unseen set for the final evaluation; do not tune against that holdout.

## Review protocol

1. Check each requirement scenario against its cited source chunk. Confirm that the expected requirement is actually supported, and that the wording does not add details absent from the source.
2. Review each unsupported case against all supplied documents, not only the EDF SRS. Remove or relabel anything supported anywhere in the source set.
3. Have the instructor or two peers independently select an SDLC (or abstain) and explain the decisive evidence. Record disagreements and resolve them before marking a label reviewed.
4. Change `label_status` to `reviewed` only after the checks above. Keep `label_status` as draft until then.
5. Report requirement extraction and SDLC decision results separately. Include denominators, exact-set match, precision/recall/F1, SDLC agreement, abstention coverage, and false recommendations.

## Run

From the project root:

```powershell
node scripts/run_agent_benchmark.js
node scripts/test_agent_logic.js
```

The first command evaluates the current browser decision logic. Its requirement metric measures the browser demo's source-match behavior; this demo does not perform general requirement extraction or call Gemini. SDLC percentages are fit scores, while benchmark agreement is calculated against draft labels. Neither is a validated real-world accuracy rate.
