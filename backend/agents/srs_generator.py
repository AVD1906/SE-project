"""Create an IEEE-style SRS PDF from the Python pipeline's generated outputs."""

import argparse
import json
import re
import textwrap
import unicodedata
from datetime import date
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
MISSING = "Not specified in supplied information."
PAGE_W, PAGE_H = 595.28, 841.89  # A4, points
LEFT, RIGHT, TOP, BOTTOM = 54, 54, 58, 54
GREEN = (0.14, 0.36, 0.29)
INK = (0.12, 0.17, 0.15)
MUTED = (0.40, 0.46, 0.43)


FIELD_NAMES = [
    "Requirement ID",
    "Customer Statement ID",
    "Requirement Statement",
    "Category",
    "Source Document",
    "Source Chunk",
    "Business Justification",
    "Priority",
    "Dependencies",
    "Assumptions",
    "Acceptance Criteria",
    "Applicable Regulations",
    "Risk Level",
    "Confidence Score",
    "Approval Status",
]


def extract_field(block, label):
    """Read one labeled field from the generated-requirements text format."""
    labels = "|".join(re.escape(name) for name in FIELD_NAMES)
    match = re.search(
        rf"^{re.escape(label)}:\s*\n(.*?)(?=^(?:{labels}):\s*$|\Z)",
        block,
        re.MULTILINE | re.DOTALL,
    )
    if not match:
        return MISSING
    value = " ".join(line.strip() for line in match.group(1).splitlines() if line.strip())
    return value or MISSING


def parse_requirements(text):
    """Extract functional requirements without including the quality-review section."""
    source = text
    if "SUPPORTED REQUIREMENTS:" in source:
        source = source.split("SUPPORTED REQUIREMENTS:", 1)[1]
    elif "GENERATED REQUIREMENTS" in source:
        source = source.split("GENERATED REQUIREMENTS", 1)[1]

    stop_markers = ["CLARIFICATION QUESTIONS:", "REQUIREMENT QUALITY ANALYSIS", "QUALITY SUMMARY"]
    stop_positions = [source.find(marker) for marker in stop_markers if source.find(marker) >= 0]
    if stop_positions:
        source = source[:min(stop_positions)]

    matches = list(re.finditer(r"(?m)^\s*(R\d+):\s*$", source))
    requirements = []
    for index, match in enumerate(matches):
        end = matches[index + 1].start() if index + 1 < len(matches) else len(source)
        block = source[match.end():end]
        statement = extract_field(block, "Requirement Statement")
        if statement == MISSING:
            continue
        requirements.append({
            "id": extract_field(block, "Requirement ID") if extract_field(block, "Requirement ID") != MISSING else match.group(1),
            "customer_id": extract_field(block, "Customer Statement ID"),
            "statement": statement,
            "category": extract_field(block, "Category"),
            "source_document": extract_field(block, "Source Document"),
            "source_chunk": extract_field(block, "Source Chunk"),
            "justification": extract_field(block, "Business Justification"),
            "priority": extract_field(block, "Priority"),
            "dependencies": extract_field(block, "Dependencies"),
            "assumptions": extract_field(block, "Assumptions"),
            "acceptance": extract_field(block, "Acceptance Criteria"),
            "regulations": extract_field(block, "Applicable Regulations"),
            "risk": extract_field(block, "Risk Level"),
            "confidence": extract_field(block, "Confidence Score"),
            "approval": extract_field(block, "Approval Status"),
        })
    if not requirements:
        raise ValueError("No labeled requirements found in the generated-requirements file.")
    return requirements


def extract_customer_statement(text):
    match = re.search(
        r"CUSTOMER STATEMENT:\s*\n(?:CS-\d+:\s*\n)?(.*?)(?=\n\s*CUSTOMER UNDERSTANDING:)",
        text,
        re.DOTALL | re.IGNORECASE,
    )
    if match:
        statement = match.group(1).strip()
        if statement and not statement.startswith("<"):
            return statement
    match = re.search(
        r"CUSTOMER REQUIREMENT\s*=+\s*(.*?)\s*=+",
        text,
        re.DOTALL | re.IGNORECASE,
    )
    return match.group(1).strip() if match else MISSING


def safe_text(value):
    replacements = {
        "–": "-", "—": "-", "−": "-", "·": "-", "→": "->",
        "“": '"', "”": '"', "‘": "'", "’": "'", "…": "...",
        "≤": "<=", "≥": ">=", "≠": "!=",
    }
    value = str(value or "")
    for old, new in replacements.items():
        value = value.replace(old, new)
    return unicodedata.normalize("NFKD", value).encode("ascii", "replace").decode("ascii")


def add_section(story, title, text=None, level=1):
    story.append((f"h{level}", title))
    if text is not None:
        story.append(("body", text or MISSING))


def build_story(title, customer_statement, requirements, characteristics):
    story = [
        ("cover", "SOFTWARE REQUIREMENTS SPECIFICATION"),
        ("cover_sub", title),
        ("cover_meta", f"Version 0.1 - Draft  |  Generated {date.today().isoformat()}"),
        ("h1", "1. Introduction"),
    ]
    add_section(story, "1.1 Purpose", f"This document specifies the requirements for {title}.", 2)
    add_section(story, "1.2 Scope", customer_statement, 2)
    add_section(story, "1.3 Definitions, Acronyms, and Abbreviations", "SRS: Software Requirements Specification. SDLC: Software Development Life Cycle.", 2)
    refs = sorted({r["source_document"] for r in requirements if r["source_document"] != MISSING})
    add_section(story, "1.4 References", "; ".join(refs) if refs else MISSING, 2)
    add_section(story, "1.5 Overview", "Section 2 describes the product. Section 3 lists the specific requirements. The appendix records the project characteristics supplied to the analysis.", 2)

    story.append(("h1", "2. General Description"))
    add_section(story, "2.1 Product Perspective", "The product provides a software system for the customer request stated in Section 1.2.", 2)
    add_section(story, "2.2 Product Functions", "The system shall provide the functional capabilities listed in Section 3.2.", 2)
    add_section(story, "2.3 User Characteristics", MISSING, 2)
    add_section(story, "2.4 General Constraints", MISSING, 2)
    add_section(story, "2.5 Assumptions and Dependencies", MISSING, 2)

    story.append(("h1", "3. Specific Requirements"))
    story.append(("h2", "3.1 External Interface Requirements"))
    for heading in ["3.1.1 User Interfaces", "3.1.2 Hardware Interfaces", "3.1.3 Software Interfaces", "3.1.4 Communications Interfaces"]:
        add_section(story, heading, MISSING, 3)

    story.append(("h2", "3.2 Functional Requirements"))
    for index, requirement in enumerate(requirements, 1):
        story.append(("h3", f"3.2.{index} Functional Requirement {requirement['id']}"))
        for label, key in [
            ("Requirement statement", "statement"),
            ("Customer statement", "customer_id"),
            ("Category", "category"),
            ("Business justification", "justification"),
            ("Source evidence", "source_document"),
            ("Source chunk", "source_chunk"),
            ("Dependencies", "dependencies"),
            ("Assumptions", "assumptions"),
            ("Acceptance criteria", "acceptance"),
            ("Applicable regulations", "regulations"),
            ("Priority", "priority"),
            ("Risk level", "risk"),
            ("Confidence score", "confidence"),
            ("Approval status", "approval"),
        ]:
            story.append(("body", f"{label}: {requirement[key]}"))

    for heading in [
        "3.3 Performance Requirements",
        "3.4 Design Constraints",
        "3.5 Logical Database Requirements",
        "3.6 Software System Attributes",
    ]:
        add_section(story, heading, MISSING, 2)

    story.append(("h1", "Appendix A. Project Characteristics"))
    if characteristics:
        for key, value in characteristics.items():
            story.append(("body", f"{key.replace('_', ' ').title()}: {value}"))
    else:
        story.append(("body", MISSING))
    story.append(("body", "Unknown values are retained as unknown and require stakeholder confirmation."))
    return story


def escape_pdf_string(text):
    return safe_text(text).replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)")


def layout_story(story):
    pages = []
    commands = []
    y = PAGE_H - TOP

    def new_page():
        nonlocal commands, y
        if commands:
            pages.append(commands)
        commands = []
        y = PAGE_H - TOP

    def text_command(text, x, baseline, font, size, color):
        escaped = escape_pdf_string(text)
        r, g, b = color
        commands.append(
            f"BT /{font} {size} Tf {r:.3f} {g:.3f} {b:.3f} rg 1 0 0 1 {x:.2f} {baseline:.2f} Tm ({escaped}) Tj ET"
        )

    for kind, raw in story:
        text = safe_text(raw)
        if kind == "cover":
            y -= 120
            text_command(text, LEFT, y, "F2", 21, GREEN)
            y -= 42
            continue
        if kind == "cover_sub":
            text_command(text, LEFT, y, "F2", 17, INK)
            y -= 30
            continue
        if kind == "cover_meta":
            text_command(text, LEFT, y, "F1", 10, MUTED)
            y -= 42
            commands.append(f"q {GREEN[0]} {GREEN[1]} {GREEN[2]} RG 1.5 w {LEFT} {y:.2f} m {PAGE_W-RIGHT} {y:.2f} l S Q")
            y -= 36
            continue

        if kind == "h1":
            size, font, color, leading, before = 16, "F2", GREEN, 21, 12
        elif kind == "h2":
            size, font, color, leading, before = 12, "F2", INK, 16, 7
        elif kind == "h3":
            size, font, color, leading, before = 10.5, "F2", GREEN, 14, 5
        else:
            size, font, color, leading, before = 9.5, "F1", INK, 12, 0

        y -= before
        max_chars = max(24, int((PAGE_W - LEFT - RIGHT) / (size * 0.50)))
        lines = []
        for paragraph in text.splitlines() or [""]:
            lines.extend(textwrap.wrap(paragraph, width=max_chars, break_long_words=True) or [""])
        if not lines:
            lines = [""]
        for line in lines:
            if y < BOTTOM + 24:
                new_page()
            text_command(line, LEFT, y, font, size, color)
            y -= leading
        if kind == "body":
            y -= 3

    if commands:
        pages.append(commands)
    return pages


def write_pdf(path, title, story):
    pages = layout_story(story)
    page_ids = [5 + i * 2 for i in range(len(pages))]
    objects = [
        "<< /Type /Catalog /Pages 2 0 R >>",
        f"<< /Type /Pages /Kids [{' '.join(f'{page_id} 0 R' for page_id in page_ids)}] /Count {len(pages)} >>",
        "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>",
        "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>",
    ]
    for index, commands in enumerate(pages):
        page_number = index + 1
        content = list(commands)
        content.append(
            f"BT /F1 8 Tf {MUTED[0]} {MUTED[1]} {MUTED[2]} rg 1 0 0 1 {LEFT} 30 Tm ({escape_pdf_string(title)}) Tj ET"
        )
        content.append(
            f"BT /F1 8 Tf {MUTED[0]} {MUTED[1]} {MUTED[2]} rg 1 0 0 1 {PAGE_W-RIGHT-55:.2f} 30 Tm (Page {page_number} of {len(pages)}) Tj ET"
        )
        stream = ("\n".join(content) + "\n").encode("ascii", "replace")
        page_id = 5 + index * 2
        stream_id = page_id + 1
        objects.extend([
            f"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 {PAGE_W:.2f} {PAGE_H:.2f}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents {stream_id} 0 R >>",
            f"<< /Length {len(stream)} >>\nstream\n".encode("ascii") + stream + b"endstream",
        ])

    output = bytearray(b"%PDF-1.4\n%Fieldnote SRS\n")
    offsets = [0]
    for object_number, obj in enumerate(objects, 1):
        offsets.append(len(output))
        body = obj if isinstance(obj, bytes) else obj.encode("ascii")
        output.extend(f"{object_number} 0 obj\n".encode("ascii"))
        output.extend(body)
        output.extend(b"\nendobj\n")
    xref_offset = len(output)
    output.extend(f"xref\n0 {len(offsets)}\n".encode("ascii"))
    output.extend(b"0000000000 65535 f \n")
    for offset in offsets[1:]:
        output.extend(f"{offset:010d} 00000 n \n".encode("ascii"))
    output.extend(
        f"trailer\n<< /Size {len(offsets)} /Root 1 0 R >>\nstartxref\n{xref_offset}\n%%EOF\n".encode("ascii")
    )
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(output)


def main():
    parser = argparse.ArgumentParser(description="Generate an IEEE-style SRS PDF from Python pipeline outputs.")
    parser.add_argument("--title", default="Digital Loan Application System")
    parser.add_argument("--requirements", type=Path, default=ROOT / "data" / "generated" / "generated_requirements.txt")
    parser.add_argument("--characteristics", type=Path, default=ROOT / "data" / "generated" / "project_characteristics.json")
    parser.add_argument("--output", type=Path, default=ROOT / "data" / "generated" / "Python_SRS.pdf")
    args = parser.parse_args()

    if not args.requirements.is_file():
        parser.error(f"Requirements file not found: {args.requirements}. Run the Python requirements-generation stage first.")
    raw = args.requirements.read_text(encoding="utf-8")
    requirements = parse_requirements(raw)
    customer_statement = extract_customer_statement(raw)
    characteristics = {}
    if args.characteristics.is_file():
        try:
            loaded = json.loads(args.characteristics.read_text(encoding="utf-8"))
            if isinstance(loaded, dict):
                characteristics = loaded
        except json.JSONDecodeError:
            characteristics = {}
    story = build_story(args.title, customer_statement, requirements, characteristics)
    write_pdf(args.output, args.title, story)
    print(f"Created SRS with {len(requirements)} functional requirements: {args.output}")


if __name__ == "__main__":
    main()
