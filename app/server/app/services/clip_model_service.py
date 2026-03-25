from __future__ import annotations

from dataclasses import dataclass
from threading import Lock
from typing import Any

import numpy as np
import open_clip
import torch
from PIL import Image

from app.config import CLIP_DEVICE, CLIP_MODEL_NAME, CLIP_PRETRAINED


@dataclass(frozen=True)
class ClipModelResources:
    model: Any
    preprocess: Any
    tokenizer: Any
    device: str
    vector_size: int


_resources: ClipModelResources | None = None
_resources_lock = Lock()


def _normalize_vector(vector: torch.Tensor) -> np.ndarray:
    normalized = vector / vector.norm(dim=-1, keepdim=True)
    return normalized[0].detach().cpu().numpy().astype(np.float32)


def _load_clip_model_resources() -> ClipModelResources:
    model, _, preprocess = open_clip.create_model_and_transforms(
        CLIP_MODEL_NAME,
        pretrained=CLIP_PRETRAINED,
    )
    tokenizer = open_clip.get_tokenizer(CLIP_MODEL_NAME)
    model = model.to(CLIP_DEVICE)
    model.eval()

    with torch.no_grad():
        sample_tokens = tokenizer(["warmup"]).to(CLIP_DEVICE)
        vector_size = int(model.encode_text(sample_tokens).shape[-1])

    return ClipModelResources(
        model=model,
        preprocess=preprocess,
        tokenizer=tokenizer,
        device=CLIP_DEVICE,
        vector_size=vector_size,
    )


def get_clip_model_resources() -> ClipModelResources:
    global _resources

    if _resources is None:
        with _resources_lock:
            if _resources is None:
                _resources = _load_clip_model_resources()

    return _resources


def warmup_clip_model() -> ClipModelResources:
    return get_clip_model_resources()


def get_clip_vector_size() -> int:
    return get_clip_model_resources().vector_size


@torch.no_grad()
def embed_text(text: str) -> np.ndarray:
    resources = get_clip_model_resources()
    normalized_text = text.strip()
    if not normalized_text:
        raise ValueError("Query text must not be empty.")

    text_tokens = resources.tokenizer([normalized_text]).to(resources.device)
    text_features = resources.model.encode_text(text_tokens)
    return _normalize_vector(text_features)


@torch.no_grad()
def embed_image(image: Image.Image) -> np.ndarray:
    resources = get_clip_model_resources()
    image_input = resources.preprocess(image.convert("RGB")).unsqueeze(0).to(resources.device)
    image_features = resources.model.encode_image(image_input)
    return _normalize_vector(image_features)
