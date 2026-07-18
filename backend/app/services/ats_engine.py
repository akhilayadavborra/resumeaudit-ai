"""
Core ATS scoring engine — combines section detection, keyword/skill matching,
formatting checks, and semantic similarity into one explainable 0-100 score.

Weights: sections 20, keywords/skills 30, formatting 20, semantic 20, contact 10.
"""
from app.services.keyword_extractor import (
    detect_sections, extract_contact_info, extract_skills,
    extract_keywords, estimate_years_of_experience,
)
from app.services.formatting_checker import check_formatting, get_line_level_suggestions
from app.services.jd_matcher import compute_semantic_similarity
from app.utils.skills_taxonomy import ROLE_PROFILES

SEVERITY_DEDUCTION = {"high": 4, "medium": 2, "low": 1}
CORE_SECTIONS = ["summary", "experience", "education", "skills"]
BONUS_SECTIONS = ["projects", "certifications", "achievements"]


def _score_sections(sections: dict) -> tuple:
    core_found = sum(1 for s in CORE_SECTIONS if sections.get(s))
    bonus_found = sum(1 for s in BONUS_SECTIONS if sections.get(s))
    score = min(((core_found / len(CORE_SECTIONS)) * 16) + min(bonus_found, 4), 20.0)
    missing = [s for s in CORE_SECTIONS if not sections.get(s)]
    return round(score, 1), missing


def _score_formatting(issues: list) -> float:
    deduction = sum(SEVERITY_DEDUCTION.get(i["severity"], 1) for i in issues)
    return round(max(0.0, 20.0 - deduction), 1)


def _score_contact(contact: dict) -> float:
    score = 0.0
    if contact.get("email"):
        score += 5
    if contact.get("phone"):
        score += 3
    if contact.get("linkedin"):
        score += 2
    return round(score, 1)


def _score_keywords_with_jd(resume_skills, resume_keywords, jd_skills, jd_keywords) -> tuple:
    resume_skill_set, jd_skill_set = set(resume_skills), set(jd_skills)
    resume_kw_set, jd_kw_set = set(resume_keywords), set(jd_keywords)

    matched_skills = sorted(resume_skill_set & jd_skill_set)
    missing_skills = sorted(jd_skill_set - resume_skill_set)
    matched_keywords = sorted(resume_kw_set & jd_kw_set)
    missing_keywords = sorted(jd_kw_set - resume_kw_set)

    skill_ratio = (len(matched_skills) / len(jd_skill_set)) if jd_skill_set else 1.0
    keyword_ratio = (len(matched_keywords) / len(jd_kw_set)) if jd_kw_set else 1.0
    score = round(((0.7 * skill_ratio) + (0.3 * keyword_ratio)) * 30, 1)

    return score, {
        "matched_skills": matched_skills, "missing_skills": missing_skills,
        "matched_keywords": matched_keywords[:15], "missing_keywords": missing_keywords[:15],
    }


def _score_keyword_density(resume_skills: list) -> float:
    return round(min(len(resume_skills) / 15, 1.0) * 30, 1)

def _score_role_match(resume_skills: list, target_role: str) -> tuple:
    """Compares detected skills against a role's critical skill set."""
    profile = ROLE_PROFILES.get(target_role)
    if not profile:
        return None, None

    resume_skill_set = set(resume_skills)
    critical_set = set(profile["critical_skills"])

    matched = sorted(resume_skill_set & critical_set)
    missing = sorted(critical_set - resume_skill_set)
    match_percent = round((len(matched) / len(critical_set)) * 100, 1) if critical_set else 0

    return {
        "role_label": profile["label"],
        "matched_critical_skills": matched,
        "missing_critical_skills": missing,
        "role_match_percent": match_percent,
    }, missing


def analyze_resume(resume_text: str, job_description: str = None, target_role: str = None) -> dict:
    sections = detect_sections(resume_text)
    contact = extract_contact_info(resume_text)
    resume_skills = extract_skills(resume_text)
    resume_keywords = extract_keywords(resume_text, top_n=30)
    formatting_issues = check_formatting(resume_text)
    role_match, missing_role_skills = _score_role_match(resume_skills, target_role) if target_role else (None, None)
    line_suggestions = get_line_level_suggestions(resume_text)
    years_experience = estimate_years_of_experience(resume_text)

    section_score, missing_sections = _score_sections(sections)
    formatting_score = _score_formatting(formatting_issues)
    contact_score = _score_contact(contact)

    if job_description and len(job_description.strip()) > 20:
        jd_skills = extract_skills(job_description)
        jd_keywords = extract_keywords(job_description, top_n=30)
        keyword_score, match_details = _score_keywords_with_jd(resume_skills, resume_keywords, jd_skills, jd_keywords)
        semantic_pct = compute_semantic_similarity(resume_text, job_description)
        semantic_score = round((semantic_pct / 100) * 20, 1)
        job_match = {"job_description_provided": True, "semantic_similarity_percent": semantic_pct, **match_details}
    else:
        keyword_score = _score_keyword_density(resume_skills)
        semantic_score = round(min(len(resume_skills) / 15, 1.0) * 20, 1)
        job_match = {"job_description_provided": False}

    total = round(section_score + keyword_score + formatting_score + semantic_score + contact_score, 1)
    total = max(0.0, min(100.0, total))

    suggestions = _generate_suggestions(missing_sections, formatting_issues, resume_skills, job_match, contact, missing_role_skills)
    return {
        "ats_score": total,
        "score_breakdown": {
            "section_completeness": section_score, "keyword_skill_match": keyword_score,
            "formatting_grammar": formatting_score, "semantic_relevance": semantic_score,
            "contact_structure": contact_score,
        },
        "sections_detected": sections,
        "missing_sections": missing_sections,
        "contact_info": contact,
        "skills_detected": resume_skills,
        "keywords_detected": resume_keywords,
        "formatting_issues": formatting_issues,
        "line_level_suggestions": line_suggestions,
        "estimated_years_experience": years_experience,
        "job_match": job_match,
        "role_match": role_match,
        "suggestions": suggestions,
    }


def _generate_suggestions(missing_sections, formatting_issues, resume_skills, job_match, contact, missing_role_skills=None) -> list:
    suggestions = []
    for section in missing_sections:
        suggestions.append(f"Add a clearly labeled '{section.title()}' section — it appears to be missing.")
    if not contact.get("email"):
        suggestions.append("Add a professional email address near the top of your resume.")
    if not contact.get("linkedin"):
        suggestions.append("Include your LinkedIn profile URL.")

    for issue in [i for i in formatting_issues if i["severity"] == "high"]:
        suggestions.append(issue["message"])

    if job_match.get("job_description_provided"):
        missing_skills = job_match.get("missing_skills", [])
        if missing_skills:
            suggestions.append(f"Consider adding these job-relevant skills if you have them: {', '.join(missing_skills[:6])}.")
        if job_match.get("semantic_similarity_percent", 0) < 50:
            suggestions.append("Your resume has low conceptual overlap with this job description. Tailor your summary and bullets to match its key responsibilities.")

    if len(resume_skills) < 8:
        suggestions.append("List more relevant technical and professional skills to improve keyword matching.")
    if missing_role_skills:
        suggestions.append(f"For this role, consider adding these commonly expected skills: {', '.join(missing_role_skills[:6])}.")

    for issue in [i for i in formatting_issues if i["severity"] == "medium"][:3]:
        suggestions.append(issue["message"])

    seen, unique = set(), []
    for s in suggestions:
        if s not in seen:
            seen.add(s)
            unique.append(s)
    return unique[:12]