"""
Real generative AI resume writing using Google's Gemini API (free tier),
via the current google-genai SDK. Takes rough/minimal user input and
produces polished, professional, ATS-friendly resume content.
"""
import json
from google import genai
from fastapi import HTTPException
from app.core.config import settings

_client = None


def _get_client():
    global _client
    if _client is None:
        if not settings.GEMINI_API_KEY:
            raise HTTPException(status_code=500, detail="AI writing is not configured on the server.")
        _client = genai.Client(api_key=settings.GEMINI_API_KEY)
    return _client


def _extract_json(text: str) -> dict:
    """Gemini sometimes wraps JSON in markdown code fences — strip those before parsing."""
    cleaned = text.strip()
    if cleaned.startswith("```"):
        cleaned = cleaned.split("```")[1]
        if cleaned.startswith("json"):
            cleaned = cleaned[4:]
    try:
        return json.loads(cleaned.strip())
    except json.JSONDecodeError:
        raise HTTPException(status_code=502, detail="AI writer returned an unexpected format. Please try again.")


# Ordered by preference — if the primary model becomes unavailable
# (Google renames/retires models periodically), it automatically falls
# back to the next one instead of hard-failing.
CANDIDATE_MODELS = ["gemini-3.5-flash", "gemini-2.5-flash-lite", "gemini-2.5-flash"]


def _generate(prompt: str) -> str:
    client = _get_client()
    last_error = None

    for model_name in CANDIDATE_MODELS:
        try:
            response = client.models.generate_content(model=model_name, contents=prompt)
            return response.text
        except Exception as e:
            last_error = e
            continue

    raise HTTPException(status_code=502, detail=f"AI writer is temporarily unavailable: {last_error}")


def generate_resume_from_details(raw_data: dict, notes: str = "") -> dict:
    prompt = f"""You are a professional resume writer. Rewrite the following rough resume details
into polished, concise, ATS-friendly professional resume content. Use strong action verbs,
quantify achievements where reasonable (do not invent specific numbers that weren't implied —
instead phrase for impact without fabricating false statistics), and keep tone professional.

Additional instructions from the user (if any): {notes or "None"}

Raw input (JSON):
{json.dumps(raw_data, indent=2)}

Return ONLY valid JSON in this exact structure, with no extra commentary:
{{
  "summary": "a polished 2-3 sentence professional summary",
  "experience": [
    {{"company": "...", "title": "...", "start_date": "...", "end_date": "...",
      "bullets": ["polished bullet 1", "polished bullet 2"]}}
  ],
  "projects": [
    {{"name": "...", "description": "...", "bullets": ["polished bullet 1"]}}
  ]
}}

Keep company names, titles, dates, and project names EXACTLY as given — only improve the
summary and bullet point WRITING QUALITY. Do not add experience or projects that weren't provided."""

    return _extract_json(_generate(prompt))


def tailor_resume_to_job(resume_text: str, job_description: str = None) -> dict:
    """
    Takes an existing (already-uploaded, parsed) resume's raw text and
    returns a rewritten, polished, ATS-optimized version. If a job
    description is provided, content is additionally tailored/prioritized
    for that specific role; otherwise it's a general professional polish.
    """
    has_jd = job_description and len(job_description.strip()) > 20

    if has_jd:
        tailoring_instruction = f"""Reorganize, rephrase, and emphasize the most relevant existing
content for this specific job description:

--- TARGET JOB DESCRIPTION ---
{job_description[:3000]}

Prioritize skills and experience most relevant to this job. The summary should emphasize fit for this role."""
    else:
        tailoring_instruction = """No specific job description was provided. Simply rewrite and polish
the resume content generally: strong action verbs, clear achievements, professional tone,
ATS-friendly structure. Do not tailor toward any specific role — improve overall quality."""

    prompt = f"""You are a professional resume writer. Do NOT invent new experience, companies,
or skills that aren't implied by the original resume. Rewrite using strong action verbs and
ATS-friendly formatting.

--- ORIGINAL RESUME TEXT ---
{resume_text[:6000]}

{tailoring_instruction}

Return ONLY valid JSON in this exact structure, with no extra commentary:
{{
  "full_name": "extracted from original resume",
  "email": "extracted from original resume, or empty string if not found",
  "phone": "extracted from original resume, or empty string if not found",
  "linkedin": "extracted from original resume, or empty string if not found",
  "summary": "a polished 2-3 sentence professional summary",
  "experience": [
    {{"company": "...", "title": "...", "start_date": "...", "end_date": "...",
      "bullets": ["polished bullet 1", "polished bullet 2"]}}
  ],
  "skills": ["skills from the original resume, most relevant first"],
  "education": [
    {{"school": "...", "degree": "...", "start_date": "...", "end_date": "..."}}
  ]
}}"""

    return _extract_json(_generate(prompt))