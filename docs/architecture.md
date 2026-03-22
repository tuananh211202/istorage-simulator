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
