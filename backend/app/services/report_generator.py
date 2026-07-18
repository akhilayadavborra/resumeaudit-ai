"""
Generates a downloadable PDF report summarizing an ATS analysis result.
"""
import io
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, ListFlowable, ListItem
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

ORANGE = colors.HexColor("#ff5a1f")
AMBER = colors.HexColor("#ffb300")


def generate_pdf_report(analysis: dict, resume_filename: str) -> bytes:
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter, topMargin=0.6 * inch, bottomMargin=0.6 * inch, leftMargin=0.7 * inch, rightMargin=0.7 * inch)
    styles = getSampleStyleSheet()

    title_style = ParagraphStyle("Title2", parent=styles["Title"], textColor=ORANGE, fontSize=22)
    heading_style = ParagraphStyle("Heading2b", parent=styles["Heading2"], textColor=ORANGE, spaceBefore=14)
    body_style = ParagraphStyle("Body2", parent=styles["BodyText"], fontSize=10, leading=14)
    score_style = ParagraphStyle("Score2", parent=styles["Title"], fontSize=48, textColor=AMBER, alignment=1)

    elements = [
        Paragraph("ResumeAudit AI — Analysis Report", title_style),
        Paragraph(f"File: {resume_filename}", body_style),
        Paragraph(f"Generated: {datetime.utcnow().strftime('%B %d, %Y at %H:%M UTC')}", body_style),
        Spacer(1, 16),
        Paragraph(f"{analysis['ats_score']} / 100", score_style),
        Paragraph("Overall ATS Compatibility Score", ParagraphStyle("Center2", parent=body_style, alignment=1)),
        Spacer(1, 20),
        Paragraph("Score Breakdown", heading_style),
    ]

    breakdown = analysis["score_breakdown"]
    table_data = [["Category", "Score"]] + [[k.replace("_", " ").title(), f"{v} pts"] for k, v in breakdown.items()]
    table = Table(table_data, colWidths=[3.5 * inch, 1.5 * inch])
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), ORANGE), ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTSIZE", (0, 0), (-1, -1), 10), ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.whitesmoke, colors.white]),
    ]))
    elements.append(table)
    elements.append(Spacer(1, 16))

    if analysis.get("missing_sections"):
        elements.append(Paragraph("Missing Sections", heading_style))
        elements.append(ListFlowable([ListItem(Paragraph(s.title(), body_style)) for s in analysis["missing_sections"]], bulletType="bullet"))

    elements.append(Paragraph("Detected Skills", heading_style))
    elements.append(Paragraph(", ".join(analysis.get("skills_detected", [])) or "No skills detected", body_style))

    job_match = analysis.get("job_match", {})
    if job_match.get("job_description_provided"):
        elements.append(Paragraph("Job Description Match", heading_style))
        elements.append(Paragraph(f"Semantic Similarity: {job_match.get('semantic_similarity_percent')}%", body_style))
        if job_match.get("missing_skills"):
            elements.append(Paragraph(f"Missing Skills: {', '.join(job_match['missing_skills'][:15])}", body_style))

    elements.append(Paragraph("Suggestions for Improvement", heading_style))
    suggestions = analysis.get("suggestions", [])
    if suggestions:
        elements.append(ListFlowable([ListItem(Paragraph(s, body_style)) for s in suggestions], bulletType="bullet"))
    else:
        elements.append(Paragraph("No major issues found. Great job!", body_style))

    doc.build(elements)
    buffer.seek(0)
    return buffer.read()