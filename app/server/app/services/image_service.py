from pathlib import Path
from urllib.parse import quote

from app.config import IMAGES_DIR, STATIC_IMAGES_ROUTE
from app.schemas import ImageItem, ImagesResponse
from app.utils.image_files import is_image_file
from .vector_search_service import search_image_items_by_text


def list_image_files() -> list[Path]:
    if not IMAGES_DIR.exists():
        return []

    image_paths = [path for path in IMAGES_DIR.iterdir() if is_image_file(path)]
    image_paths.sort(key=lambda path: path.name.lower())
    return image_paths


def build_image_url(base_url: str, filename: str) -> str:
    return f"{base_url.rstrip('/')}{STATIC_IMAGES_ROUTE}/{quote(filename)}"


def get_images(
    *,
    base_url: str,
    search: str,
    page: int,
    limit: int,
) -> ImagesResponse:
    normalized_search = search.strip().lower()

    image_paths = list_image_files()

    total_items = len(image_paths)
    total_pages = 0 if total_items == 0 else (total_items + limit - 1) // limit
    start_index = (page - 1) * limit
    end_index = start_index + limit

    items = [
        ImageItem(
            id=path.name,
            filename=path.name,
            imageUrl=build_image_url(base_url, path.name),
        )
        for path in image_paths[start_index:end_index]
    ]

    if len(normalized_search) > 0:
        search_results = search_image_items_by_text(query_text=normalized_search, limit=100, base_url=base_url)
        items = [
            ImageItem(
                id=item.id,
                filename=item.filename,
                imageUrl=item.imageUrl,
            )
            for item in search_results[start_index:end_index]
        ]

    return ImagesResponse(
        items=items,
        page=page,
        limit=limit,
        totalItems=total_items,
        totalPages=total_pages,
        hasMore=page < total_pages,
    )
