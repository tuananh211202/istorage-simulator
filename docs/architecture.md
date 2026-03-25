# Architecture

## Phase

Phase 2: backend integration

This document describes the phase-2 system architecture for both the frontend and the backend. The gallery remains intentionally simple, but the structure should support future growth without requiring a rewrite.

## Stack

### Frontend

- Vite
- React
- TypeScript

### Backend

- FastAPI backend in Python under `app/server`
- file-based image discovery from the local filesystem
- Qdrant for vector storage and nearest-neighbor search
- CLIP-compatible embeddings generated with `open_clip`

## Code Locations

- Frontend application: `app/client`
- Backend application: `app/server`
- Image storage directory for this phase: `app/server/images`

## Architecture Goal

Move the gallery from mock data to a real backend integration while keeping the backend file-based, simple to understand, and organized into clear layers that can scale later.

## Frontend Responsibilities

The frontend in `app/client` remains responsible for:

- rendering the gallery page
- rendering the search bar
- rendering the image grid and image cards
- managing loading, empty, error, and pagination states
- calling the real backend API instead of local mock data

### Frontend Data Flow

- On page load, the frontend calls `GET http://localhost:8000/api/images?page=1&limit=10` in local development unless overridden by configuration.
- On search submit, the frontend calls the backend API with `search`, resets pagination, and replaces the current result set.
- On "Load more", the frontend calls the backend API for the next page and appends returned items.
- The image card caption uses `filename`.
- Frontend API requests should target the backend directly through a configurable base URL.
- Frontend API requests should bypass browser caching for `/api/images` so the gallery always receives a fresh JSON response.

### Mock API Removal

- The phase-1 mock service is removed or replaced in phase 2.
- Frontend data access should go through a real API service layer that targets the backend contract defined in `docs/api-contract.md`.

## Backend Responsibilities

The backend in `app/server` is responsible for:

- reading available image files from `app/server/images`
- exposing static image files for browser access
- exposing the image listing API
- validating query parameters
- filtering by filename
- applying pagination
- returning a stable response shape for the frontend
- loading the embedding model once during application startup
- providing reusable Qdrant access helpers for collection and point operations
- providing reusable vector search helpers for text-to-image retrieval

## Suggested Backend Structure

The backend should use a simple layered structure such as:

- `app/config.py`
- `app/main.py`
- `app/routes`
- `app/services`
- `app/utils`
- `app/schemas.py`

## Layer Responsibilities

### `app/config.py`

- application configuration
- path configuration such as the images directory
- environment-specific values when needed

### `app/routes`

- route definitions
- API endpoint registration
- wiring endpoints to service calls

### `app/services`

- business logic for listing image files
- filename filtering
- pagination logic
- conversion from filenames to API response items
- consistent sorting of filenames before pagination
- singleton embedding model access and text/image embedding helpers
- singleton Qdrant client access and collection helper functions
- text-to-image vector search orchestration that maps Qdrant hits into reusable response objects

### `app/utils`

- reusable helpers such as filename checks, pagination helpers, or path-safe utilities

### `app/schemas.py`

- response models and shared API schema definitions

## Backend Data Flow

1. The client sends `GET /api/images` with optional `search`, `page`, and `limit`.
2. The FastAPI route validates query parameters and calls the service layer.
3. The service reads files from `app/server/images`.
4. The service filters matching filenames when `search` is provided.
5. The service paginates the matching results.
6. The route returns the response shape defined in `docs/api-contract.md`.
7. Static image requests are served from the backend image path.

## Internal Vector Search Flow

1. The application startup path eagerly initializes the CLIP-compatible model once for the process lifetime.
2. A service needing semantic retrieval calls the vector search service with a text query and result limit.
3. The vector search service uses the shared embedding service to encode and normalize the query text.
4. The vector search service uses the shared Qdrant service to query the configured collection with cosine similarity.
5. Ranked hits are converted into reusable image result objects containing filename, public image URL, and similarity score.
6. Qdrant payloads used by this flow should include a server-servable filename directly or enough information to derive it from `file_path`.

## Internal Service Boundary

- Public HTTP behavior remains unchanged until a dedicated vector-search route is documented.
- `qdrant_service` owns Qdrant client initialization and low-level collection or point operations.
- `vector_search_service` owns semantic-search business logic and hit-to-image mapping.
- `clip_model_service` owns model startup, tokenization, preprocessing, and embedding generation.

## Runtime Notes

- The FastAPI server runs on port `8000` by default in local development.
- The frontend should call the FastAPI server directly, typically through `http://localhost:8000`.
- The backend returns public `imageUrl` values so the frontend can render images directly.
- The backend may allow local frontend origins such as `http://localhost:5173` for direct API calls during development.
- The backend should mark `/api/images` responses as non-cacheable in development-facing usage to avoid `304` responses interfering with gallery data loading.

## Frontend and Backend Boundary

- The backend owns filesystem access and API response generation.
- The frontend owns presentation and request state management.
- The frontend should not inspect local filesystem paths directly.
- The backend should not embed frontend presentation logic.

## Deferred Future Work

- upload APIs
- database-backed metadata
- richer file validation and processing
- caching and performance optimizations
- advanced search and sort capabilities
