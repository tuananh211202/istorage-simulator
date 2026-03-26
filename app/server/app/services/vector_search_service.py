from __future__ import annotations

from pathlib import Path
from typing import Any
from urllib.parse import quote

from app.config import QDRANT_VECTOR_COLLECTION, STATIC_IMAGES_ROUTE, VECTOR_SEARCH_DEFAULT_LIMIT
from app.schemas import VectorSearchImageItem, VectorSearchResponse
from app.services.clip_model_service import embed_text
from app.services.qdrant_service import query_similar_points


def _extract_served_filename(payload: dict[str, Any]) -> str:
    for key in ("filename", "stored_filename"):
        value = payload.get(key)
        if isinstance(value, str) and value.strip():
            return Path(value).name

    file_path = payload.get("file_path")
    if isinstance(file_path, str) and file_path.strip():
        return Path(file_path).name

    raise ValueError(
        "Qdrant payload must include filename, stored_filename, or file_path."
    )


def _extract_display_filename(payload: dict[str, Any], served_filename: str) -> str:
    original_name = payload.get("original_name")
    if isinstance(original_name, str) and original_name.strip():
        return Path(original_name).name

    return served_filename


def search_image_items_by_text(
    *,
    query_text: str,
    limit: int = VECTOR_SEARCH_DEFAULT_LIMIT,
    collection_name: str = QDRANT_VECTOR_COLLECTION,
    base_url: str,
) -> list[VectorSearchImageItem]:
    normalized_query = query_text.strip()
    if not normalized_query:
        raise ValueError("Query text must not be empty.")

    hits = query_similar_points(
        collection_name=collection_name,
        query_vector=embed_text(normalized_query).tolist(),
        limit=limit,
        with_payload=True,
    )

    items: list[VectorSearchImageItem] = []
    for hit in hits:
        payload = dict(hit.payload or {})
        served_filename = _extract_served_filename(payload)
        display_filename = _extract_display_filename(payload, served_filename)
        image_url = f"{base_url.rstrip('/')}{STATIC_IMAGES_ROUTE}/{quote(served_filename)}"
        items.append(
            VectorSearchImageItem(
                id=served_filename,
                filename=display_filename,
                imageUrl=image_url,
                score=float(hit.score or 0.0),
            )
        )

    return items

