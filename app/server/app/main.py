from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles

from app.config import ALLOWED_CORS_ORIGINS, IMAGES_DIR
from app.routes.images import router as images_router
from app.schemas import ErrorResponse

app = FastAPI(title="Image Gallery API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_CORS_ORIGINS,
    allow_credentials=False,
    allow_methods=["GET"],
    allow_headers=["*"],
)

app.mount("/images", StaticFiles(directory=IMAGES_DIR), name="images")
app.include_router(images_router)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(
    _request: Request,
    _exc: RequestValidationError,
) -> JSONResponse:
    payload = ErrorResponse(
        error={
            "code": "INVALID_QUERY",
            "message": 'Query parameters "page" and "limit" must be positive integers.',
        }
    )
    return JSONResponse(status_code=400, content=payload.model_dump())


@app.exception_handler(Exception)
async def unhandled_exception_handler(
    _request: Request,
    _exc: Exception,
) -> JSONResponse:
    payload = ErrorResponse(
        error={
            "code": "INTERNAL_SERVER_ERROR",
            "message": "Unable to process the request.",
        }
    )
    return JSONResponse(status_code=500, content=payload.model_dump())
