"""
Curated taxonomy of technical & professional skills used for extraction
and job-description matching.
"""

SKILLS_TAXONOMY = {
    "programming_languages": [
        "python", "java", "javascript", "typescript", "c++", "c#", "go", "golang",
        "rust", "ruby", "php", "swift", "kotlin", "scala", "r", "matlab", "perl", "dart",
    ],
    "web_frontend": [
        "react", "vue", "angular", "next.js", "nuxt.js", "svelte", "html", "css",
        "sass", "tailwind css", "bootstrap", "redux", "webpack", "vite", "jquery",
    ],
    "web_backend": [
        "node.js", "express", "django", "flask", "fastapi", "spring boot", "ruby on rails",
        "laravel", "asp.net", "graphql", "rest api", "grpc", "microservices",
    ],
    "databases": [
        "mongodb", "postgresql", "mysql", "sqlite", "redis", "elasticsearch",
        "cassandra", "dynamodb", "oracle", "sql server", "firebase", "neo4j",
    ],
    "cloud_devops": [
        "aws", "azure", "gcp", "docker", "kubernetes", "terraform", "jenkins",
        "ci/cd", "github actions", "gitlab ci", "ansible", "nginx", "linux",
        "cloudformation", "helm", "prometheus", "grafana",
    ],
    "data_ml": [
        "machine learning", "deep learning", "tensorflow", "pytorch", "keras",
        "scikit-learn", "pandas", "numpy", "nlp", "computer vision", "data analysis",
        "data visualization", "tableau", "power bi", "spark", "hadoop", "airflow",
        "generative ai", "llm", "opencv",
    ],
    "mobile": ["android", "ios", "react native", "flutter", "xamarin", "swift ui"],
    "tools": ["git", "github", "jira", "confluence", "figma", "postman", "vs code", "slack", "notion", "trello"],
    "methodologies": ["agile", "scrum", "kanban", "tdd", "devops", "waterfall", "lean"],
    "soft_skills": [
        "leadership", "communication", "teamwork", "problem solving",
        "critical thinking", "time management", "project management",
        "collaboration", "adaptability", "mentoring", "stakeholder management",
        "presentation", "negotiation", "conflict resolution",
    ],
    "business": [
        "product management", "business analysis", "marketing", "sales",
        "seo", "digital marketing", "financial analysis", "budgeting",
        "strategic planning", "customer success", "crm", "salesforce",
    ],
}


def get_flat_skill_set() -> set:
    flat = set()
    for skills in SKILLS_TAXONOMY.values():
        flat.update(skills)
    return flat


ALL_SKILLS = get_flat_skill_set()
MULTI_WORD_SKILLS = sorted([s for s in ALL_SKILLS if " " in s or "." in s or "+" in s], key=len, reverse=True)
SINGLE_WORD_SKILLS = {s for s in ALL_SKILLS if s not in MULTI_WORD_SKILLS}

RESUME_SECTIONS = {
    "summary": ["summary", "professional summary", "objective", "profile", "about me", "career objective"],
    "experience": ["experience", "work experience", "employment history", "professional experience", "work history"],
    "education": ["education", "academic background", "academic qualifications"],
    "skills": ["skills", "technical skills", "core competencies", "key skills", "expertise"],
    "projects": ["projects", "personal projects", "academic projects", "key projects"],
    "certifications": ["certifications", "certificates", "licenses", "credentials"],
    "achievements": ["achievements", "awards", "honors", "accomplishments"],
}
# Role-specific critical skill sets — used to score a resume against what
# actually matters for a target role, instead of treating all skills equally.
ROLE_PROFILES = {
    "software_engineer": {
        "label": "Software Engineer",
        "critical_skills": ["python", "java", "javascript", "react", "node.js", "sql", "git",
                             "rest api", "docker", "aws", "data structures", "algorithms"],
    },
    "data_analyst": {
        "label": "Data Analyst",
        "critical_skills": ["sql", "python", "excel", "tableau", "power bi", "data analysis",
                             "data visualization", "pandas", "statistics", "r"],
    },
    "ai_engineer": {
        "label": "AI / ML Engineer",
        "critical_skills": ["python", "machine learning", "deep learning", "tensorflow", "pytorch",
                             "nlp", "scikit-learn", "pandas", "numpy", "computer vision", "llm"],
    },
    "frontend_developer": {
        "label": "Frontend Developer",
        "critical_skills": ["react", "javascript", "typescript", "html", "css", "tailwind css",
                             "vue", "redux", "webpack", "figma"],
    },
    "backend_developer": {
        "label": "Backend Developer",
        "critical_skills": ["python", "java", "node.js", "express", "django", "fastapi", "sql",
                             "mongodb", "rest api", "microservices", "docker", "redis"],
    },
    "product_manager": {
        "label": "Product Manager",
        "critical_skills": ["product management", "stakeholder management", "agile", "scrum",
                             "data analysis", "roadmapping", "user research", "jira"],
    },
    "devops_engineer": {
        "label": "DevOps Engineer",
        "critical_skills": ["docker", "kubernetes", "aws", "azure", "terraform", "ci/cd",
                             "jenkins", "linux", "ansible", "prometheus", "grafana"],
    },
}