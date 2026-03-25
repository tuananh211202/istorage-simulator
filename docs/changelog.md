# Changelog

## 2026-03-22

### Phase 1

- created the initial frontend-only documentation baseline for the gallery
- documented the mocked frontend API, gallery behavior, UI states, and frontend-only architecture
- implemented the initial frontend in `app/client`

### Phase 2

- updated project documentation to introduce backend integration under `app/server`
- replaced the phase-1 mocked API contract with a real backend API contract for image listing
- documented `app/server/images` as the temporary image source directory
- documented that frontend data loading now uses the real backend API instead of mock data
- documented filename-based search behavior
- documented that image captions now use `filename`
- replaced the initial Node.js and TypeScript backend implementation with FastAPI and Python
- replaced the frontend mock data service with real API calls
- added static image serving from `app/server/images`
- added filename-based filtering, pagination, and query validation in the backend
- updated the API contract so `imageUrl` is a directly usable public image link
- disabled API caching for gallery data requests so frontend fetches do not fail on `304 Not Modified`
- changed the frontend to call the backend directly on port `8000` instead of relying on Vite proxy paths
- added `.gitignore` files for `app/client` and `app/server` so dependency folders, build output, Python cache, local virtual environments, and image storage files are not committed

### Why

- move the project from a frontend-only prototype to a real frontend-backend integration
- keep the backend file-based and simple while remaining organized for future expansion
- keep the repository limited to source files and required manifests instead of generated or local-only assets

### Impacted Areas

- `docs/product-spec.md`
- `docs/ui-states.md`
- `docs/api-contract.md`
- `docs/architecture.md`
- `docs/changelog.md`
- `app/client/.gitignore`
- `app/server/.gitignore`

## 2026-03-23

### Phase 2

- documented an internal backend vector search capability based on CLIP-compatible embeddings and Qdrant
- documented that the embedding model is initialized once at backend startup and reused by services
- added reusable backend services for CLIP embedding access, Qdrant access, and text-to-image vector retrieval
- kept the public HTTP API unchanged while preparing backend services for future semantic-search routes

### Why

- add semantic text-to-image retrieval building blocks without changing the current frontend or public API scope
- avoid repeated model initialization cost by loading the embedding model a single time per process
- keep vector-search logic reusable from other backend services

### Impacted Areas

- `docs/product-spec.md`
- `docs/architecture.md`
- `docs/api-contract.md`
- `docs/changelog.md`
- `app/server/requirements.txt`
- `app/server/app/config.py`
- `app/server/app/main.py`
- `app/server/app/schemas.py`
- `app/server/app/services/__init__.py`
- `app/server/app/services/clip_model_service.py`
- `app/server/app/services/qdrant_service.py`
- `app/server/app/services/vector_search_service.py`
