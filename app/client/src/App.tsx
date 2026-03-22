import { useEffect, useState } from "react";
import { ImageGrid } from "./components/ImageGrid";
import { SearchBar } from "./components/SearchBar";
import { fetchImages } from "./services/imageApi";
import type { ApiErrorResponse, ImageItem, Pagination } from "./types";

const PAGE_SIZE = 10;

const emptyPagination: Pagination = {
  page: 1,
  limit: PAGE_SIZE,
  totalItems: 0,
  totalPages: 0,
  hasMore: false,
};

type RequestMode = "initial" | "search" | "load-more";

function getErrorMessage(error: unknown, fallback: string) {
  if (
    typeof error === "object" &&
    error !== null &&
    "error" in error &&
    typeof (error as ApiErrorResponse).error?.message === "string"
  ) {
    return (error as ApiErrorResponse).error.message;
  }

  return fallback;
}

export default function App() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState<Pagination>(emptyPagination);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [loadMoreError, setLoadMoreError] = useState<string | null>(null);

  useEffect(() => {
    void runRequest({ mode: "initial", search: "", page: 1 });
  }, []);

  async function runRequest({
    mode,
    search,
    page,
  }: {
    mode: RequestMode;
    search: string;
    page: number;
  }) {
    if (mode !== "load-more") {
      setSearchTerm(search);
    }

    if (mode === "initial") {
      setIsInitialLoading(true);
    }

    if (mode === "search") {
      setIsSearching(true);
      setRequestError(null);
      setLoadMoreError(null);
    }

    if (mode === "load-more") {
      setIsLoadingMore(true);
      setLoadMoreError(null);
    }

    if (mode !== "load-more") {
      setRequestError(null);
    }

    try {
      const response = await fetchImages({
        search,
        page,
        limit: PAGE_SIZE,
      });

      setPagination({
        page: response.page,
        limit: response.limit,
        totalItems: response.totalItems,
        totalPages: response.totalPages,
        hasMore: response.hasMore,
      });

      if (mode === "load-more") {
        setImages((currentImages) => [...currentImages, ...response.items]);
      } else {
        setImages(response.items);
      }
    } catch (error) {
      const fallbackMessage =
        mode === "load-more"
          ? "Unable to load more images."
          : "Unable to fetch images.";
      const message = getErrorMessage(error, fallbackMessage);

      if (mode === "load-more") {
        setLoadMoreError(message);
      } else {
        setRequestError(message);
        setImages([]);
        setPagination(emptyPagination);
      }
    } finally {
      if (mode === "initial") {
        setIsInitialLoading(false);
      }

      if (mode === "search") {
        setIsSearching(false);
      }

      if (mode === "load-more") {
        setIsLoadingMore(false);
      }
    }
  }

  function handleSearchSubmit(value: string) {
    void runRequest({ mode: "search", search: value, page: 1 });
  }

  function handleRetry() {
    void runRequest({ mode: "search", search: searchTerm, page: 1 });
  }

  function handleLoadMore() {
    if (!pagination.hasMore || isLoadingMore) {
      return;
    }

    void runRequest({
      mode: "load-more",
      search: searchTerm,
      page: pagination.page + 1,
    });
  }

  const showFullPageLoading = isInitialLoading || isSearching;
  const showEmptyState = !showFullPageLoading && !requestError && images.length === 0;
  const showRequestError = !showFullPageLoading && requestError !== null;
  const showResults = !showFullPageLoading && !showRequestError && images.length > 0;
  const resultLabel =
    searchTerm.trim().length > 0
      ? `Showing ${pagination.totalItems} results for "${searchTerm}".`
      : `Showing ${images.length} of ${pagination.totalItems} images.`;

  return (
    <main className="page-shell">
      <section className="gallery-panel">
        <header className="gallery-header">
          <div>
            <p className="gallery-eyebrow">Phase 2 backend integration</p>
            <h1 className="gallery-title">Image gallery</h1>
            <p className="gallery-description">
              Browse images from the backend, search by filename, and load more
              results as needed.
            </p>
          </div>
          <SearchBar initialValue={searchTerm} onSubmit={handleSearchSubmit} />
        </header>

        {showFullPageLoading ? (
          <section className="status-panel">
            <div className="loader" aria-hidden="true" />
            <p>{isSearching ? "Searching images..." : "Loading images..."}</p>
          </section>
        ) : null}

        {showRequestError ? (
          <section className="status-panel status-panel--error" role="alert">
            <h2>Something went wrong</h2>
            <p>{requestError}</p>
            <button className="secondary-button" onClick={handleRetry} type="button">
              Retry
            </button>
          </section>
        ) : null}

        {showEmptyState ? (
          <section className="status-panel">
            <h2>No images found</h2>
            <p>
              {searchTerm
                ? `No images matched "${searchTerm}". Try another keyword.`
                : "No images are available right now."}
            </p>
          </section>
        ) : null}

        {showResults ? (
          <>
            <div className="results-summary">
              <p>{resultLabel}</p>
            </div>
            <ImageGrid images={images} />
          </>
        ) : null}

        {showResults ? (
          <footer className="gallery-footer">
            {loadMoreError ? (
              <p className="inline-error" role="alert">
                {loadMoreError}
              </p>
            ) : null}

            {pagination.hasMore ? (
              <button
                className="primary-button"
                onClick={handleLoadMore}
                type="button"
                disabled={isLoadingMore}
              >
                {isLoadingMore ? "Loading more..." : "Load more"}
              </button>
            ) : (
              <p className="pagination-end">No more images to load.</p>
            )}
          </footer>
        ) : null}
      </section>
    </main>
  );
}
