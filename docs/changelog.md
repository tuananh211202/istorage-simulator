# Changelog

## 2026-03-26

### Phase 2

- documented image-card quick actions for product detail and adding an image to chat
- documented a responsive bottom chat dock that opens from add-to-chat actions
- documented local chat persistence through `localStorage`
- documented a local chat composer for sending text messages inside the chat dock
- documented sender-specific chat styling and simulated bot echo replies
- documented auto-scroll behavior and a local model selector for simulated replies
- updated the frontend to render card actions, append selected images into chat, send text messages, simulate model-labeled echoes, auto-scroll, and restore chat history locally
- compacted the chat header and composer so the message area keeps more visible space
- reduced message bubble size and removed the extra chat title text
- further compacted the model selector and send controls, and vertically centered the header label
- replaced chat close/send text buttons with compact icons and shortened the visible model selector labels
- moved the composer into a two-row compact block, removed the send button, and added placeholder upload/mic tools
- aligned the tool row into left and right sections and made uploaded images append into chat immediately
- refined the model selector so it stays compact but more legible
- expanded the model selector again to show clearer model names
- changed uploaded images into removable pending attachments that send on Enter together with text
- changed card-level add-to-chat actions to use the same pending-attachment composer flow

### Why

- prepare the gallery cards for product-oriented interactions without introducing backend changes
- support a lightweight image-to-chat workflow that works on both desktop and mobile layouts
- preserve temporary chat context across page refreshes in the browser

### Impacted Areas

- `docs/product-spec.md`
- `docs/ui-states.md`
- `docs/architecture.md`
- `docs/changelog.md`
- `app/client/src/App.tsx`
- `app/client/src/components/ImageCard.tsx`
- `app/client/src/components/ImageGrid.tsx`
- `app/client/src/styles.css`
- `app/client/src/types.ts`

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
