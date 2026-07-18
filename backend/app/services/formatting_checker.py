"""
Rule-based grammar & formatting checks for resumes.
Line-level detection finds the EXACT weak sentence and shows a full
BEFORE -> AFTER rewritten example using the formula:
Action Verb + What You Did + Measurable Result.
"""
import re

STRONG_VERBS = {"led", "built", "designed", "implemented", "managed", "developed", "created", "launched", "optimized", "improved", "increased", "reduced", "contributed"}

# Generic/vague filler phrases that say almost nothing about actual impact.
# Each maps to ONE fully-written example showing the technique applied,
# so the user can see the exact transformation, not just a rule.
GENERIC_FILLER_EXAMPLES = [
    {
        "patterns": ["selected for", "chosen for", "was selected", "was chosen"],
        "problem": 'Says you were *chosen* for a role, but nothing about what you actually did or achieved in it.',
        "example_before": "Selected for the Marketing Internship program",
        "example_after": "Contributed to a 3-person marketing team, launching 2 email campaigns that increased click-through rate by 15%",
    },
    {
        "patterns": ["was a part of", "was part of", "member of the team", "part of a team"],
        "problem": "Describes your presence on a team, not your contribution to it.",
        "example_before": "Was part of the product development team",
        "example_after": "Contributed to the product development team by designing 3 new features, reducing user drop-off by 12%",
    },
    {
        "patterns": ["responsible for", "in charge of", "tasked with"],
        "problem": "Describes a duty you were assigned, not the outcome you delivered.",
        "example_before": "Responsible for managing social media accounts",
        "example_after": "Managed 4 social media accounts, growing combined followers by 8,000 in 6 months",
    },
    {
        "patterns": ["worked on", "helped with", "assisted with", "was involved in"],
        "problem": "Vague verb that hides your actual level of contribution.",
        "example_before": "Worked on the company website redesign",
        "example_after": "Rebuilt 5 key pages of the company website, cutting average load time by 40%",
    },
    {
        "patterns": ["duties included", "day to day tasks", "daily activities"],
        "problem": "Reads like a job description, not an achievement.",
        "example_before": "Duties included answering customer emails and updating records",
        "example_after": "Resolved 30+ customer emails daily with a 95% satisfaction rating, while maintaining accurate records for 200+ accounts",
    },
    {
        "patterns": ["good communication skills", "hard working", "team player", "detail oriented", "fast learner"],
        "problem": "A generic self-description with no evidence behind it — ATS and recruiters weight proven achievements far higher than adjectives.",
        "example_before": "Good communication skills and a team player",
        "example_after": "Presented weekly project updates to a 12-person cross-functional team, aligning stakeholders on priorities",
    },
]


def check_formatting(resume_text: str) -> list:
    """General document-level issues (length, contact info, structure)."""
    issues = []
    lines = [l for l in resume_text.split("\n") if l.strip()]
    word_count = len(resume_text.split())

    if word_count < 150:
        issues.append({"type": "length", "severity": "high", "message": "Resume is too short. Aim for 400-800 words."})
    elif word_count > 1200:
        issues.append({"type": "length", "severity": "medium", "message": "Resume is quite long. Consider trimming to 1-2 pages."})

    if not re.search(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}", resume_text):
        issues.append({"type": "contact", "severity": "high", "message": "No email address detected."})

    bullet_lines = [l for l in lines if re.match(r"^\s*[•\-\*▪●]", l)]
    if len(bullet_lines) < 3:
        issues.append({"type": "structure", "severity": "medium", "message": "Few bullet points detected. Use bullets instead of paragraphs for experience details."})

    return issues


def get_line_level_suggestions(resume_text: str, max_suggestions: int = 8) -> list:
    """
    Scans each line for weak/generic phrasing and returns a full
    BEFORE -> AFTER rewritten example demonstrating exactly how to fix it,
    following the formula: Action Verb + What You Did + Measurable Result.
    """
    lines = [l.strip() for l in resume_text.split("\n") if l.strip()]
    suggestions = []
    seen_lines = set()

    for line in lines:
        if len(suggestions) >= max_suggestions:
            break

        clean_line = re.sub(r"^[•\-\*▪●]\s*", "", line)
        lower_line = clean_line.lower()

        if len(clean_line) < 10 or len(clean_line) > 220 or clean_line in seen_lines:
            continue

        # 1. Match against known generic/weak filler patterns
        matched_entry = None
        for entry in GENERIC_FILLER_EXAMPLES:
            if any(p in lower_line for p in entry["patterns"]):
                matched_entry = entry
                break

        if matched_entry:
            suggestions.append({
                "original_text": clean_line,
                "problem": matched_entry["problem"],
                "example_before": matched_entry["example_before"],
                "example_after": matched_entry["example_after"],
                "formula": "Action Verb + What You Did + Measurable Result",
            })
            seen_lines.add(clean_line)
            continue

        # 2. Bullet-like line with a decent verb but missing any measurable result at all
        is_bullet_like = bool(re.match(r"^[A-Z][a-z]", clean_line)) and len(clean_line.split()) >= 5
        has_strong_verb = any(re.match(r"^" + v, lower_line) for v in STRONG_VERBS)
        has_metric = bool(re.search(r"\b\d+%|\$\d+|\b\d{2,}\b", clean_line))

        if is_bullet_like and has_strong_verb and not has_metric:
            suggestions.append({
                "original_text": clean_line,
                "problem": "Uses a strong action verb, but doesn't say what happened as a result.",
                "example_before": clean_line,
                "example_after": f"{clean_line}, resulting in [add a specific number, %, or $ outcome here]",
                "formula": "Action Verb + What You Did + Measurable Result",
            })
            seen_lines.add(clean_line)

    return suggestions