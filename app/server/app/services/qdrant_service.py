from __future__ import annotations

from threading import Lock
from typing import Any, Iterable, Sequence

from qdrant_client import QdrantClient
from qdrant_client.http.models import Distance, PointStruct, ScoredPoint, VectorParams

from app.config import QDRANT_API_KEY, QDRANT_LOCAL_PATH, QDRANT_URL


_client: QdrantClient | None = None
_client_lock = Lock()


def _create_qdrant_client() -> QdrantClient:
    if QDRANT_LOCAL_PATH:
        return QdrantClient(path=QDRANT_LOCAL_PATH)

    client_kwargs: dict[str, Any] = {"url": QDRANT_URL}
    if QDRANT_API_KEY:
        client_kwargs["api_key"] = QDRANT_API_KEY

    return QdrantClient(**client_kwargs)


def get_qdrant_client() -> QdrantClient:
    global _client

    if _client is None:
        with _client_lock:
            if _client is None:
                _client = _create_qdrant_client()

    return _client


def collection_exists(collection_name: str) -> bool:
    client = get_qdrant_client()
    collections = client.get_collections().collections
    return any(collection.name == collection_name for collection in collections)


def ensure_collection(
    *,
    collection_name: str,
    vector_size: int,
    distance: Distance = Distance.COSINE,
    recreate: bool = False,
) -> None:
    client = get_qdrant_client()

    if recreate and collection_exists(collection_name):
        client.delete_collection(collection_name=collection_name)

    if not recreate and collection_exists(collection_name):
        return

    client.create_collection(
        collection_name=collection_name,
        vectors_config=VectorParams(size=vector_size, distance=distance),
    )


def upsert_points(
    *,
    collection_name: str,
    points: Iterable[PointStruct],
) -> None:
    get_qdrant_client().upsert(collection_name=collection_name, points=list(points))


def query_similar_points(
    *,
    collection_name: str,
    query_vector: Sequence[float],
    limit: int,
    with_payload: bool = True,
) -> list[ScoredPoint]:
    result = get_qdrant_client().query_points(
        collection_name=collection_name,
        query=list(query_vector),
        limit=limit,
        with_payload=with_payload,
    )
    return list(result.points)
