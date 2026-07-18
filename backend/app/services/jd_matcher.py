"""
Semantic similarity between resume and job description using Sentence Transformers.
"""
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

_model = None


def get_model():
    global _model
    if _model is None:
        _model = SentenceTransformer("all-MiniLM-L6-v2")
    return _model


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


def compute_semantic_similarity(resume_text: str, job_description: str) -> float:
    model = get_model()
    doc_embeddings = model.encode([resume_text, job_description])
    overall_sim = cosine_similarity([doc_embeddings[0]], [doc_embeddings[1]])[0][0]

    resume_chunks = _chunk_text(resume_text)
    jd_embedding = doc_embeddings[1].reshape(1, -1)
    chunk_embeddings = model.encode(resume_chunks)
    chunk_sims = cosine_similarity(chunk_embeddings, jd_embedding).flatten()
    best_chunk_sim = float(np.max(chunk_sims)) if len(chunk_sims) else overall_sim

    blended = (0.6 * overall_sim) + (0.4 * best_chunk_sim)
    return round(max(0.0, min(1.0, blended)) * 100, 1)