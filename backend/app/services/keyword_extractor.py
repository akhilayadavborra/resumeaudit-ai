"""
NLP-based skill, keyword, and section extraction using spaCy.
"""
import re
import spacy
from collections import Counter
from app.utils.skills_taxonomy import MULTI_WORD_SKILLS, SINGLE_WORD_SKILLS, RESUME_SECTIONS

_nlp = None


def get_nlp():
    global _nlp
    if _nlp is None:
        _nlp = spacy.load("en_core_web_sm")
    return _nlp


STOP_KEYWORDS = {"years", "year", "experience", "work", "team", "company", "role", "job", "ability", "strong"}


def extract_skills(text: str) -> list:
    lower_text = f" {text.lower()} "
    found = set()

    for skill in MULTI_WORD_SKILLS:
        pattern = r"(?<![a-z0-9])" + re.escape(skill) + r"(?![a-z0-9])"
        if re.search(pattern, lower_text):
            found.add(skill)

    tokens = set(re.findall(r"[a-z0-9\+\#\.]+", lower_text))
    for skill in SINGLE_WORD_SKILLS:
        if skill in tokens:
            found.add(skill)

    return sorted(found)


def extract_keywords(text: str, top_n: int = 25) -> list:
    nlp = get_nlp()
    doc = nlp(text[:100000])
    candidates = []

    for chunk in doc.noun_chunks:
        term = chunk.text.strip().lower()
        term = re.sub(r"^(the|a|an|my|our|their|his|her)\s+", "", term)
        if 2 <= len(term) <= 40 and term not in STOP_KEYWORDS:
            candidates.append(term)

    for token in doc:
        if token.pos_ in ("PROPN", "NOUN") and not token.is_stop and len(token.text) > 2:
            candidates.append(token.text.lower())

    freq = Counter(candidates)
    ranked = [(term, count) for term, count in freq.most_common(top_n * 2) if not term.isdigit()]
    return [term for term, _ in ranked[:top_n]]


def detect_sections(resume_text: str) -> dict:
    lines = resume_text.split("\n")
    found = {section: False for section in RESUME_SECTIONS}

    for line in lines:
        clean_line = line.strip().lower().rstrip(":")
        if not clean_line or len(clean_line) > 45:
            continue
        for section, aliases in RESUME_SECTIONS.items():
            if found[section]:
                continue
            if clean_line in aliases:
                found[section] = True

    return found


def extract_contact_info(resume_text: str) -> dict:
    email_match = re.search(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}", resume_text)
    phone_match = re.search(r"(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}", resume_text)
    linkedin_match = re.search(r"(linkedin\.com/in/[A-Za-z0-9\-_/]+)", resume_text, re.IGNORECASE)

    return {
        "email": email_match.group(0) if email_match else None,
        "phone": phone_match.group(0) if phone_match else None,
        "linkedin": linkedin_match.group(0) if linkedin_match else None,
    }


def estimate_years_of_experience(text: str) -> float:
    matches = re.findall(r"(\d{1,2}(?:\.\d)?)\s*\+?\s*years?", text.lower())
    if matches:
        values = [float(m) for m in matches if float(m) <= 45]
        if values:
            return max(values)
    return 0.0