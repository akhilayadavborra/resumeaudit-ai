// Temporary mock data so the UI is fully testable before the backend exists.
// Every value here will be replaced by real API responses in a later stage.

export const MOCK_STATS = {
  total_analyses: 7,
  average_score: 71.4,
  highest_score: 88,
  latest_score: 82,
  score_trend: [
    { date: "Jul 01", score: 54 }, { date: "Jul 03", score: 61 },
    { date: "Jul 06", score: 70 }, { date: "Jul 09", score: 75 },
    { date: "Jul 12", score: 82 },
  ],
};

export const MOCK_ANALYSES = [
  { id: "1", filename: "Resume_v4.pdf", ats_score: 82, created_at: "2026-07-12T09:00:00Z" },
  { id: "2", filename: "Resume_v3.pdf", ats_score: 75, created_at: "2026-07-09T09:00:00Z" },
  { id: "3", filename: "Resume_v2.docx", ats_score: 61, created_at: "2026-07-03T09:00:00Z" },
];

export const MOCK_ACTIVITY = [
  { type: "analysis", message: "Analyzed Resume_v4.pdf — scored 82", time: "2 days ago" },
  { type: "report", message: "Downloaded PDF report", time: "2 days ago" },
  { type: "upload", message: "Uploaded Resume_v4.pdf", time: "2 days ago" },
];

export const MOCK_ANALYSIS_DETAIL = {
  filename: "Resume_v4.pdf",
  ats_score: 82,
  score_breakdown: { section_completeness: 18, keyword_skill_match: 25, formatting_grammar: 17, semantic_relevance: 15, contact_structure: 9 },
  sections_detected: { summary: true, experience: true, education: true, skills: true, projects: true, certifications: false },
  contact_info: { email: "you@example.com", phone: "(415) 555-0148", linkedin: "linkedin.com/in/you" },
  estimated_years_experience: 5,
  skills_detected: ["python", "react", "aws", "docker", "fastapi", "sql"],
  job_match: {
    job_description_provided: true,
    semantic_similarity_percent: 78.5,
    matched_skills: ["python", "react", "aws"],
    missing_skills: ["terraform", "graphql"],
  },
  formatting_issues: [
    { severity: "medium", message: "Few strong action verbs detected. Start bullets with 'Led', 'Built', 'Optimized'." },
  ],
  suggestions: [
    "Add a 'Certifications' section — it appears to be missing.",
    "Consider adding these job-relevant skills: terraform, graphql.",
  ],
};