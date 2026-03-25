import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
IMAGES_DIR = BASE_DIR / "images"
STATIC_IMAGES_ROUTE = "/images"
DEFAULT_LIMIT = 10
DEFAULT_PORT = 8000
ALLOWED_CORS_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:4173",
    "http://127.0.0.1:4173",
]

ALLOWED_IMAGE_EXTENSIONS = {
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".webp",
    ".bmp",
    ".svg",
    ".avif",
}

QDRANT_URL = os.getenv("QDRANT_URL", "http://localhost:6333")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")
QDRANT_LOCAL_PATH = os.getenv("QDRANT_LOCAL_PATH")
QDRANT_VECTOR_COLLECTION = os.getenv("QDRANT_VECTOR_COLLECTION", "istorage_clip")
VECTOR_SEARCH_DEFAULT_LIMIT = 5
CLIP_MODEL_NAME = os.getenv("CLIP_MODEL_NAME", "ViT-B-32")
CLIP_PRETRAINED = os.getenv("CLIP_PRETRAINED", "laion2b_s34b_b79k")
# CLIP_DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
CLIP_DEVICE = "cpu"
