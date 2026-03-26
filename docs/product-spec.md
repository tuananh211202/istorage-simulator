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
- internal vector search service for text-to-image retrieval against pre-indexed image embeddings
- pagination through a "Load more" button
- image cards displaying the image preview and filename
- image card quick actions for product detail and adding the image to chat
- local-only chat dock for staging image-related conversation content
- responsive gallery layout
- frontend integration with the real backend API

## Out of Scope for Phase 2

- authentication or user accounts
- database design or persistence
- image upload API
- backend chat API or server-side chat persistence
- image deletion or editing
- admin tools
- advanced metadata extraction
- a public HTTP endpoint or frontend flow for vector search
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
11. On any image card, the user can click a product-detail action to trigger the prepared detail handler.
12. On any image card, the user can click an add-to-chat action to open the chat dock and append that image into the current chat.
13. The frontend restores the latest local chat history from `localStorage` when available.

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

## Internal Vector Search Capability

- The backend also supports an internal service for retrieving images from a natural-language text query.
- This capability uses CLIP-compatible text and image embeddings together with a Qdrant collection that already contains indexed image vectors.
- The internal vector search capability is intended for reuse by backend services and future routes.
- The current phase does not expose vector search directly in the existing frontend gallery flow.
- If the vector collection is empty or unavailable, the capability should fail clearly instead of silently returning fabricated results.

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
- Each image card also displays two action buttons aligned to the bottom-right area of the text section.
- The first action button is for viewing product details.
- The second action button is for adding the image into the chat.
- Both actions may use placeholder handlers for now, but the intended action must be wired and callable from the UI.

The filename is the visible caption for this phase and replaces the previous mocked title-based caption.

## Chat Dock Behavior

- The frontend provides a local chat dock attached to the bottom edge of the viewport.
- On desktop or larger screens, the chat dock width is one third of the viewport width and must not exceed `400px`.
- On narrow mobile screens, the chat dock expands to the full viewport width.
- Clicking the add-to-chat action on an image card:
  - opens the chat dock if it is currently closed
  - appends a new chat entry referencing the selected image
  - keeps only the selected image visible in the chat content without extra caption text
- The chat dock includes a message input for plain text messages.
- The chat dock includes a model selector for choosing the simulated reply identity.
- The chat dock also includes compact placeholder tools for image upload and microphone input.
- Choosing an image from the upload tool attaches that image into the composer without sending it immediately.
- An attached image is shown on the top line of the composer and can be removed before sending.
- Sending a text message appends that message into the current local chat thread as a user message.
- Pressing `Enter` in the message input submits the current composer contents, including any attached image and text.
- After a user text message is sent, the frontend appends a simulated reply that repeats the same text content.
- The simulated reply label must use the currently selected model name instead of a generic bot label.
- Text messages must visually distinguish sender identity through alignment and color treatment.
- When new chat entries are appended or the chat is opened, the message list should automatically scroll to the latest entry.
- The chat header and composer should remain visually compact so the message list keeps most of the available dock height.
- Message bubbles should remain compact so more conversation content fits within the visible chat area.
- The input and chat tools should be grouped into a single compact composer block.
- Within the tool row, the model selector should stay on the left side and the upload or microphone tools should stay grouped on the right side.
- The close action may use an icon-only button as long as its purpose remains accessible.
- The model selector should prefer compact visible labels while preserving the full selected model name for reply labeling.
- The model selector should remain visually clear enough to identify the current choice at a glance.
- When space allows, the model selector should show an explicit model name instead of an overly abbreviated label.
- Chat content, including image entries and text messages, is stored in `localStorage` so it survives page refresh within the same browser.
- The chat dock remains a frontend-only feature for this phase; no backend chat integration is required.

## Responsive Behavior

- The gallery must remain responsive on mobile and larger screens.
- The search bar remains at the top of the page content.
- The image layout uses fewer columns on narrow screens and more columns on wider screens.
- The filename caption must remain readable without breaking the layout.
- Card action buttons must remain reachable and readable on both mobile and desktop layouts.
- The chat dock remains pinned to the bottom of the viewport and adapts between desktop-width and full-width mobile presentation.

## Acceptance Criteria

- The frontend loads image data from the real backend API instead of a mocked API.
- The backend reads image files from `app/server/images`.
- On first load, the frontend requests page `1` with `limit=10` and displays the returned items.
- Each image card shows the image preview and its filename.
- Submitting a search filters results by filename through the backend API.
- A new search resets pagination to page `1`.
- Clicking "Load more" requests the next page and appends results.
- The UI handles initial loading, empty results, API errors, loading more, and load more errors.
- Each image card shows a detail action and an add-to-chat action.
- Clicking add-to-chat opens the chat dock and places the selected image into the composer as a pending attachment.
- The chat dock allows the user to type and send text messages.
- The chat dock allows the user to choose a simulated model from a local select control.
- The chat dock shows placeholder upload-image and microphone tools in the composer.
- Uploading an image places it into the composer first, and pressing `Enter` sends it.
- Using the image-card add-to-chat action also places that image into the composer first, and pressing `Enter` sends it.
- Image chat entries display only the image content.
- User and model text messages are shown on different sides with distinct colors.
- New messages auto-scroll the chat view to the bottom.
- The chat dock restores previously stored local chat entries after page reload.
- The chat dock remains bottom-aligned, responsive, and limited to one third width up to `400px` on larger screens.
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
- Local chat history is missing or invalid: the frontend falls back to an empty chat without crashing.
- Repeated add-to-chat clicks for different images: the frontend appends each selected image as a separate chat entry in order.
- Repeated add-to-chat clicks before sending replace the current pending attachment with the latest selected image.
- Submitting an empty chat message: the frontend does not append an empty entry.
- Removing an attached image before sending leaves the text input intact.
- Pressing `Enter` with a non-empty message submits the message without a separate send button.
- Simulated model reply should mirror the exact user text for this phase.

## Deferred Future Work

- upload workflow for adding images through the application
- database-backed metadata or indexing
- richer search behavior beyond filename matching
- public API and UI integration for vector search
- image validation and processing pipeline
- sorting and filtering options beyond the current simple behavior
