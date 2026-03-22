from pathlib import Path

from app.config import ALLOWED_IMAGE_EXTENSIONS


def is_image_file(path: Path) -> bool:
    return path.is_file() and path.suffix.lower() in ALLOWED_IMAGE_EXTENSIONS
