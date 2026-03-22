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
