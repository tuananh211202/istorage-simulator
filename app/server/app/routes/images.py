from fastapi import APIRouter, Query, Request, Response

from app.config import DEFAULT_LIMIT
from app.schemas import ImagesResponse
from app.services.image_service import get_images

router = APIRouter(prefix="/api", tags=["images"])


@router.get("/images", response_model=ImagesResponse)
def list_images(
    request: Request,
    response: Response,
    search: str = Query(default=""),
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=DEFAULT_LIMIT, ge=1),
) -> ImagesResponse:
    response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "0"

    return get_images(
        base_url=str(request.base_url).rstrip("/"),
        search=search,
        page=page,
        limit=limit,
    )
