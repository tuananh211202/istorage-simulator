# UI States

## Phase

Phase 2: backend integration

This document defines the frontend UI states for the gallery when data comes from the real backend API.

## Shared Controls

- Search input at the top of the page
- Search submit action
- Image list or grid area
- "Load more" button at the bottom when more results exist

## State: Initial Loading

Description:

- The page has mounted and the first request to the backend API is in progress.

UI behavior:

- Show the search bar in its default enabled state.
- Show a loading indicator or loading placeholders in the gallery area.
- Do not show image cards until the first request resolves.
- Do not show the "Load more" button while the first page is loading.

Input and button behavior:

- Search input: enabled
- Search submit: enabled
- Load more: hidden

## State: Loaded Default Results

Description:

- The initial backend request succeeded and returned one or more items.

UI behavior:

- Show the first page of results returned by the server.
- Each card shows the image preview and filename.
- Show the "Load more" button only if the server response indicates additional pages are available.

Input and button behavior:

- Search input: enabled
- Search submit: enabled
- Load more: enabled when more pages exist, otherwise hidden or disabled

## State: Searching

Description:

- A search request is in progress after the user submits a filename keyword.

UI behavior:

- The gallery transitions into a search loading state.
- The interface must clearly indicate that a new backend result set is being requested.
- Pagination resets to the first page for the new search.

Input and button behavior:

- Search input: enabled
- Search submit: enabled
- Load more: hidden or disabled while the search request is in progress

## State: Search Results

Description:

- A backend search request succeeded and returned one or more matching items.

UI behavior:

- Show image cards matching the filename search term.
- Replace any previous results with the new search results.
- Show the "Load more" button only when the server indicates more matching pages are available.

Input and button behavior:

- Search input: enabled
- Search submit: enabled
- Load more: enabled when more pages exist, otherwise hidden or disabled

## State: Empty Results

Description:

- The server request succeeded but returned no items.

UI behavior:

- Show a clear empty state in the gallery area.
- If the empty state is caused by a search, indicate that no filenames matched the keyword.
- If the empty state is caused by the default request, indicate that no images are currently available from the server.
- Do not show empty image cards or broken placeholders.

Input and button behavior:

- Search input: enabled
- Search submit: enabled
- Load more: hidden

## State: API Error

Description:

- The initial request or a search request failed before usable results could be displayed for the current query.

UI behavior:

- Show a clear error message in the main gallery area.
- Provide a retry action for the failed request.
- Do not show partial or invalid results for the failed query state.

Input and button behavior:

- Search input: enabled
- Search submit: enabled
- Load more: hidden
- Retry action: enabled

## State: Loading More

Description:

- An additional page request is in progress after the user clicks "Load more".

UI behavior:

- Keep already loaded images visible.
- Show progress feedback near the bottom of the list or on the button itself.
- Do not clear the current results while waiting for the next page.

Input and button behavior:

- Search input: enabled
- Search submit: enabled
- Load more: disabled while the request is in progress

## State: Load More Error

Description:

- A pagination request failed after at least one valid page was already shown.

UI behavior:

- Keep the existing image list visible.
- Show a localized error message near the pagination controls.
- Provide a retry action for the failed pagination request.
- Do not discard previously loaded pages.

Input and button behavior:

- Search input: enabled
- Search submit: enabled
- Load more: enabled for retry after the failed request completes

## State Transition Rules

- Initial loading transitions to loaded default results, empty results, or API error.
- Searching transitions to search results, empty results, or API error.
- Loading more transitions back to loaded default results or search results with appended items, or to load more error.
- A new submitted search clears the previous pagination state and starts again from page `1`.
- If the server returns zero items for the current request, the frontend enters the empty results state.

## Deferred Future Work

- backend-specific error differentiation beyond the basic UI states
- image-level fallback handling for partially inaccessible files
