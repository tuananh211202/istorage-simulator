from pydantic import BaseModel


class ImageItem(BaseModel):
    id: str
    filename: str
    imageUrl: str


class ImagesResponse(BaseModel):
    items: list[ImageItem]
    page: int
    limit: int
    totalItems: int
    totalPages: int
    hasMore: bool


class VectorSearchImageItem(ImageItem):
    score: float


class VectorSearchResponse(BaseModel):
    query: str
    limit: int
    totalItems: int
    items: list[VectorSearchImageItem]


class ErrorBody(BaseModel):
    code: str
    message: str


class ErrorResponse(BaseModel):
    error: ErrorBody
