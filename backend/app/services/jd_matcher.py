"""
Semantic similarity between resume and job description using Gemini's
embedding API (remote) instead of a locally-loaded model — this avoids
pulling in PyTorch/sentence-transformers, which is far too memory-heavy
for a free-tier deployment.
"""
from google import genai
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from app.core.config import settings

_client = None


def _get_client():
    global _client
    if _client is None:
        _client = genai.Client(api_key=settings.GEMINI_API_KEY)
    return _client


def _chunk_text(text: str, max_chars: int = 500) -> list:
    paragraphs = [p.strip() for p in text.split("\n") if p.strip()]
    chunks, current = [], ""
    for p in paragraphs:
        if len(current) + len(p) < max_chars:
            current += " " + p
        else:
            if current:
                chunks.append(current.strip())
            current = p
    if current:
        chunks.append(current.strip())
    return chunks if chunks else [text]


def _embed_texts(texts: list) -> list:
    client = _get_client()
    result = client.models.embed_content(model="text-embedding-004", contents=texts)
    return [np.array(e.values) for e in result.embeddings]


def compute_semantic_similarity(resume_text: str, job_description: str) -> float:
    embeddings = _embed_texts([resume_text[:8000], job_description[:4000]])
    overall_sim = cosine_similarity([embeddings[0]], [embeddings[1]])[0][0]

    resume_chunks = _chunk_text(resume_text)[:10]  # cap chunks to limit API calls
    chunk_embeddings = _embed_texts(resume_chunks)
    jd_embedding = embeddings[1].reshape(1, -1)
    chunk_sims = cosine_similarity(np.array(chunk_embeddings), jd_embedding).flatten()
    best_chunk_sim = float(np.max(chunk_sims)) if len(chunk_sims) else overall_sim

    blended = (0.6 * overall_sim) + (0.4 * best_chunk_sim)
    return round(max(0.0, min(1.0, blended)) * 100, 1)