# UI States

## Phase

Phase 2: backend integration

This document defines the frontend UI states for the gallery when data comes from the real backend API.

## Shared Controls

- Search input at the top of the page
- Search submit action
- Image list or grid area
- "Load more" button at the bottom when more results exist
- Product-detail action on each image card
- Add-to-chat action on each image card
- Bottom-aligned chat dock that can be closed and reopened through add-to-chat

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
- Each card shows detail and add-to-chat actions in the caption area.
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
- Preserve card-level detail and add-to-chat actions for each result.
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
- Keep any existing local chat history available in the chat dock.

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

## State: Chat Closed

Description:

- No chat dock is currently visible.

UI behavior:

- Image card add-to-chat actions remain available.
- Triggering add-to-chat opens the chat dock and inserts the selected image entry immediately.

Input and button behavior:

- Add-to-chat: enabled
- Close chat: not visible

## State: Chat Open With Messages

Description:

- The bottom chat dock is visible and has one or more locally stored messages.

UI behavior:

- Show the message list anchored in a bottom-aligned dock.
- Show image-based chat entries as image-only bubbles.
- Show an attached-image preview at the top of the composer when an image has been selected but not yet sent.
- Show a compact message composer at the bottom of the dock with the text input on the first row.
- Show a model selector for controlling the simulated responder label.
- Show upload-image and microphone placeholder tools on the second row of the composer.
- Keep the model selector aligned to the left edge of the tool row and the upload or microphone tools aligned to the right edge.
- Keep the model selector visually distinct enough to read the current model quickly.
- Prefer an explicit visible model name in the selector when the available width allows it.
- Show user and model text messages on opposite sides with distinct color styling.
- Keep the dock width responsive: full width on narrow screens, otherwise one third of the viewport up to `400px`.
- Auto-scroll the message list to the newest message when content is appended.
- Keep non-message areas compact so the message list remains the dominant visible region.
- Keep message bubbles compact so more messages remain visible without scrolling.
- Keep the input and tool controls grouped into one compact composer block.
- Allow icon-only close and tool buttons within the compact chrome.

Input and button behavior:

- Add-to-chat: enabled and places an image into the pending attachment area
- Model select: enabled
- Image upload tool: enabled
- Microphone tool: enabled
- Chat input: enabled
- Enter key submit: enabled when the input has non-empty content
- Remove attached image: enabled when a pending image exists
- Close chat: enabled

## State: Chat Open Empty

Description:

- The bottom chat dock is visible but no local messages are currently stored.

UI behavior:

- Show an empty guidance state inside the dock.
- Keep the dock available for the next add-to-chat action.
- Keep the message composer visible so the user can start the conversation immediately.
- Keep the model selector visible so the user can choose the simulated responder before sending.

Input and button behavior:

- Add-to-chat: enabled
- Model select: enabled
- Image upload tool: enabled
- Microphone tool: enabled
- Chat input: enabled
- Enter key submit: enabled when the input has non-empty content
- Close chat: enabled

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
- Add-to-chat transitions chat closed or chat open empty into chat open with messages.
- Add-to-chat from an image card opens the dock and creates a pending attachment preview instead of sending immediately.
- Sending a text message in chat open empty transitions the dock into chat open with messages.
- Sending a text message appends a user bubble first and then a simulated model bubble with the same text.
- Uploading an image from the composer creates a pending attachment preview instead of sending immediately.
- Pressing `Enter` sends the pending attachment and current text together when present.
- Closing the chat hides the dock without deleting the stored local message history.
- Reloading the page restores the last valid local chat history before rendering the dock contents.

## Deferred Future Work

- backend-specific error differentiation beyond the basic UI states
- image-level fallback handling for partially inaccessible files
