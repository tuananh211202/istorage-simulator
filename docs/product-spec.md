# Product Spec

## Phase

Phase 2: backend integration

This phase defines the image gallery as a frontend and backend system. The frontend remains under `app/client`. A real backend is introduced under `app/server` and becomes the source of image data for the gallery. Images are read from the filesystem in `app/server/images`.

## Feature Goal

Provide a simple, responsive image gallery that allows users to:

- view images returned by the real backend API
- search images by filename
- load additional pages of results

The phase-2 goal is to replace the mocked frontend data flow with a real backend integration while keeping the scope file-based and simple.

## In Scope for Phase 2

- frontend application in `app/client`
- backend application in `app/server`
- real image listing API exposed by the backend
- images read from `app/server/images`
- default initial load of 10 images per page
- filename-based search
- pagination through a "Load more" button
- image cards displaying the image preview and filename
- responsive gallery layout
- frontend integration with the real backend API

## Out of Scope for Phase 2

- authentication or user accounts
- database design or persistence
- image upload API
- image deletion or editing
- admin tools
- advanced metadata extraction
- sorting options beyond current filesystem order unless later defined

## Data Model

Each image item in phase 2 contains at least:

- `id`
- `filename`
- `imageUrl`

No additional metadata should be assumed for this phase unless later documented.

## User Flow

1. User opens the gallery page.
2. The frontend requests the first page of images from the backend API using `page=1` and `limit=10`.
3. The backend reads available image files from `app/server/images`, applies filename filtering if needed, and returns the paginated result set.
4. The frontend displays image previews and filenames.
5. The user enters a keyword in the search bar and submits the search.
6. The frontend requests page `1` for the new search term from the backend API.
7. The backend filters images by filename matching and returns matching items.
8. The frontend replaces the current list with the new results.
9. If more results are available, the user clicks "Load more".
10. The frontend requests the next page and appends the returned items to the current list.

## Default Load Behavior

- On initial page load, the frontend requests 10 images from the backend API.
- The default request uses:
  - `search` empty
  - `page` set to `1`
  - `limit` set to `10`
- The backend returns the first page of image items based on the files currently available in `app/server/images`.
- If the request fails, the frontend shows an error state with retry behavior.

## Search Behavior

- Search is based on image filename matching.
- The search input appears at the top of the gallery page.
- When a search is submitted:
  - the frontend sends the search term to the backend API
  - pagination resets to page `1`
  - the current result list is replaced by the new response
- If the search field is cleared and resubmitted, the gallery returns to the default unfiltered result set starting from page `1`.
- Filename matching is the temporary search behavior for phase 2 and does not require any database-backed search logic.

## Load More Behavior

- A "Load more" button appears below the current results when additional pages are available.
- Clicking "Load more":
  - requests the next page from the backend API using the current search term
  - appends new items to the existing list
  - preserves already loaded images
- If there are no more results, the button is hidden or disabled based on UI choice, but the end of pagination must be clear to the user.
- If loading more fails, already displayed results remain visible and the user can retry.

## Image Card Behavior

- Each image card displays:
  - the image preview loaded from `imageUrl`
  - the image filename shown as text below the image

The filename is the visible caption for this phase and replaces the previous mocked title-based caption.

## Responsive Behavior

- The gallery must remain responsive on mobile and larger screens.
- The search bar remains at the top of the page content.
- The image layout uses fewer columns on narrow screens and more columns on wider screens.
- The filename caption must remain readable without breaking the layout.

## Acceptance Criteria

- The frontend loads image data from the real backend API instead of a mocked API.
- The backend reads image files from `app/server/images`.
- On first load, the frontend requests page `1` with `limit=10` and displays the returned items.
- Each image card shows the image preview and its filename.
- Submitting a search filters results by filename through the backend API.
- A new search resets pagination to page `1`.
- Clicking "Load more" requests the next page and appends results.
- The UI handles initial loading, empty results, API errors, loading more, and load more errors.
- The gallery remains responsive across mobile and larger screens.
- No authentication, database, upload API, or admin functionality is introduced in this phase.

## Edge Cases

- Empty image folder: the backend returns zero items and the frontend shows an empty state.
- Invalid page query: the backend returns an error response instead of silently using an invalid page value.
- Invalid limit query: the backend returns an error response instead of silently using an invalid limit value.
- Image file not accessible: the backend should avoid returning broken data when possible; if a file path cannot be served correctly, the request should fail clearly or omit unusable entries based on the final implementation choice.
- No results for search: the backend returns zero items and the frontend shows an empty search state.
- User searches after loading multiple pages: the frontend resets visible results and pagination before showing the new result set.
- Load more is triggered when no next page exists: the frontend does not request additional pages.
- Initial API request fails: the frontend shows a page-level error state.
- Load more request fails: the frontend keeps existing images visible and shows a retry path near the pagination controls.

## Deferred Future Work

- upload workflow for adding images through the application
- database-backed metadata or indexing
- richer search behavior beyond filename matching
- image validation and processing pipeline
- sorting and filtering options beyond the current simple behavior
