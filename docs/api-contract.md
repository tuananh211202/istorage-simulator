# API Contract

## Phase

Phase 2: backend integration

This document defines the real backend contract used by the frontend in phase 2. The backend serves image listing data and static image files. The frontend should use this contract instead of the phase-1 mock API.

Implementation note for phase 2:

- the backend is implemented with FastAPI in Python under `app/server`

## Contract Purpose

- provide real image listing data from the backend
- support default gallery loading
- support filename-based search
- support pagination through `page` and `limit`
- expose static image URLs for browser rendering

## Public HTTP Scope

- The only documented public HTTP endpoint in phase 2 remains `GET /api/images`.
- Internal vector search services may exist in the backend, but they are not part of the public HTTP contract until a route is documented here.

## Image Listing Endpoint

- `GET /api/images`

This endpoint returns paginated image items based on the files currently available in `app/server/images`.

## Query Parameters

### `search`

- Type: string
- Required: no
- Meaning: filters results by filename matching
- Default: empty string

### `page`

- Type: number
- Required: no
- Meaning: 1-based page index
- Default: `1`

### `limit`

- Type: number
- Required: no
- Meaning: number of items returned per page
- Default: `10`

## Search Behavior

- Search is based on filename matching.
- Matching behavior is case-insensitive unless later documented otherwise.
- The backend filters available files by filename before pagination is applied.
- Results are sorted consistently by filename in ascending order before pagination is applied.

## Successful Response Shape

```json
{
  "items": [
    {
      "id": "beach-sunrise.jpg",
      "filename": "beach-sunrise.jpg",
      "imageUrl": "http://localhost:8000/images/beach-sunrise.jpg"
    }
  ],
  "page": 1,
  "limit": 10,
  "totalItems": 18,
  "totalPages": 2,
  "hasMore": true
}
```

## Response Field Definitions

### `items`

- Array of image items for the current query and page

### Image item

- `id`: stable identifier for the image item in this phase
- `filename`: original filename shown in the UI
- `imageUrl`: usable public image URL served by the backend

### Pagination fields

- `page`: current page number
- `limit`: number of items requested per page
- `totalItems`: total number of matching image files
- `totalPages`: total number of available pages for the current query and limit
- `hasMore`: boolean flag indicating whether another page can be requested

## Example Requests

Default gallery load:

```http
GET /api/images?page=1&limit=10
```

Filename search:

```http
GET /api/images?search=beach&page=1&limit=10
```

Load more for current search:

```http
GET /api/images?search=beach&page=2&limit=10
```

## Error Response Shape

```json
{
  "error": {
    "code": "INVALID_QUERY",
    "message": "Query parameters \"page\" and \"limit\" must be positive integers."
  }
}
```

## Error Field Definitions

- `error.code`: stable error identifier
- `error.message`: human-readable error message

## Suggested Error Cases

- invalid `page`
- invalid `limit`
- internal server failure while reading image files

## Static Image URL Exposure

- Static image files are stored in `app/server/images`.
- The backend exposes these files under a public static path such as `/images/<filename>`.
- The `imageUrl` returned by `GET /api/images` must be a directly usable public URL for the browser.
- In local development, returned URLs may look like `http://localhost:8000/images/<filename>`.

## Contract Rules for Phase 2

- The frontend should treat this document as the source of truth for backend integration.
- The frontend should stop using the mocked API from phase 1.
- The backend should not assume database-backed metadata in this phase.
- Returned image items should be derived from accessible files in `app/server/images`.
- Pagination metadata should be returned explicitly and should not be inferred by the frontend.

## Deferred Future Work

- authentication or authorization
- upload endpoints
- richer metadata
- persistent database-backed records
- advanced search behavior beyond filename matching
- public vector-search HTTP endpoints
