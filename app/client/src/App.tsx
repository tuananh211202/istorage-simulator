import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { ImageGrid } from "./components/ImageGrid";
import { SearchBar } from "./components/SearchBar";
import { fetchImages } from "./services/imageApi";
import type {
  ApiErrorResponse,
  ChatMessage,
  ImageItem,
  Pagination,
} from "./types";

const PAGE_SIZE = 10;
const CHAT_STORAGE_KEY = "image-gallery-chat-history";
const CHAT_MODEL_STORAGE_KEY = "image-gallery-chat-model";
const CHAT_MODELS = [
  { value: "GPT-4o mini", label: "GPT-4o" },
  { value: "GPT-4.1 mini", label: "GPT-4.1" },
  { value: "o4-mini", label: "o4-mini" },
] as const;
type ChatModelValue = (typeof CHAT_MODELS)[number]["value"];
const CHAT_MODEL_VALUES = CHAT_MODELS.map((model) => model.value);

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

function loadStoredChatMessages() {
  if (typeof window === "undefined") {
    return [];
  }

  const storedValue = window.localStorage.getItem(CHAT_STORAGE_KEY);

  if (!storedValue) {
    return [];
  }

  try {
    const parsedValue = JSON.parse(storedValue) as ChatMessage[];

    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return parsedValue.filter(
      (message) =>
        message &&
        typeof message.id === "string" &&
        typeof message.createdAt === "string" &&
        ((message.type === "image" &&
          message.sender === "user" &&
          typeof message.image?.id === "string" &&
          typeof message.image?.filename === "string" &&
          typeof message.image?.imageUrl === "string") ||
          (message.type === "text" &&
            (message.sender === "user" || message.sender === "bot") &&
            typeof message.text === "string" &&
            (message.modelName === undefined ||
              typeof message.modelName === "string"))),
    );
  } catch {
    return [];
  }
}

function loadStoredChatModel() {
  if (typeof window === "undefined") {
    return CHAT_MODELS[0].value;
  }

  const storedValue = window.localStorage.getItem(CHAT_MODEL_STORAGE_KEY);

  if (
    storedValue &&
    CHAT_MODEL_VALUES.includes(storedValue as ChatModelValue)
  ) {
    return storedValue as ChatModelValue;
  }

  return CHAT_MODELS[0].value;
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }

      reject(new Error("Unable to read file as data URL."));
    };

    reader.onerror = () => {
      reject(new Error("Unable to read uploaded file."));
    };

    reader.readAsDataURL(file);
  });
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
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() =>
    loadStoredChatMessages(),
  );
  const [chatInput, setChatInput] = useState("");
  const [pendingAttachment, setPendingAttachment] = useState<ImageItem | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedChatModel, setSelectedChatModel] = useState(loadStoredChatModel);
  const chatMessagesRef = useRef<HTMLDivElement | null>(null);
  const uploadInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    void runRequest({ mode: "initial", search: "", page: 1 });
  }, []);

  useEffect(() => {
    window.localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(chatMessages));
  }, [chatMessages]);

  useEffect(() => {
    window.localStorage.setItem(CHAT_MODEL_STORAGE_KEY, selectedChatModel);
  }, [selectedChatModel]);

  useEffect(() => {
    if (!isChatOpen || !chatMessagesRef.current) {
      return;
    }

    chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
  }, [chatMessages, isChatOpen]);

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

  function handleViewDetails(image: ImageItem) {
    console.log("Planned action: view product details", image);
  }

  function handleAddToChat(image: ImageItem) {
    console.log("Planned action: add image to chat", image);
    setPendingAttachment(image);
    setIsChatOpen(true);
  }

  function handleChatSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextValue = chatInput.trim();
    const nextMessages: ChatMessage[] = [];

    if (!nextValue && !pendingAttachment) {
      return;
    }

    if (pendingAttachment) {
      const attachmentMessage: ChatMessage = {
        id: `attachment-${Date.now()}`,
        type: "image",
        sender: "user",
        image: pendingAttachment,
        createdAt: new Date().toISOString(),
      };

      console.log("Planned action: send pending image attachment", attachmentMessage);
      nextMessages.push(attachmentMessage);
    }

    if (nextValue) {
      const nextMessage: ChatMessage = {
        id: `text-${Date.now()}`,
        type: "text",
        sender: "user",
        text: nextValue,
        createdAt: new Date().toISOString(),
      };
      const botReply: ChatMessage = {
        id: `bot-${Date.now()}`,
        type: "text",
        sender: "bot",
        text: nextValue,
        createdAt: new Date().toISOString(),
        modelName: selectedChatModel,
      };

      console.log("Planned action: send chat message", nextMessage);
      console.log("Planned action: bot echo reply", botReply);
      nextMessages.push(nextMessage, botReply);
    }

    setChatMessages((currentMessages) => [...currentMessages, ...nextMessages]);
    setChatInput("");
    setPendingAttachment(null);
    setIsChatOpen(true);
  }

  function handleMicClick() {
    console.log("Planned action: open microphone input");
  }

  function handleUploadClick() {
    uploadInputRef.current?.click();
  }

  function handleRemoveAttachment() {
    setPendingAttachment(null);
  }

  async function handleUploadChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const imageUrl = await readFileAsDataUrl(file);
      const nextAttachment: ImageItem = {
        id: `upload-${Date.now()}`,
        filename: file.name,
        imageUrl,
      };

      console.log("Planned action: attach image into composer", {
        name: file.name,
        type: file.type,
        size: file.size,
      });
      setPendingAttachment(nextAttachment);
      setIsChatOpen(true);
    } catch (error) {
      console.error("Unable to upload image into chat", error);
    }

    event.target.value = "";
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
            <ImageGrid
              images={images}
              onViewDetails={handleViewDetails}
              onAddToChat={handleAddToChat}
            />
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

      {isChatOpen ? (
        <aside
          className="chat-dock"
          aria-label="Image chat"
        >
          <div className="chat-dock__header">
            <div>
              <p className="chat-dock__eyebrow">Local chat</p>
            </div>
            <button
              className="chat-dock__close"
              onClick={() => setIsChatOpen(false)}
              type="button"
              aria-label="Close chat"
              title="Close chat"
            >
              x
            </button>
          </div>

          <div className="chat-dock__messages" ref={chatMessagesRef}>
            {chatMessages.length === 0 ? (
              <div className="chat-empty-state">
                <p>No messages yet. Add an image or type a message below.</p>
              </div>
            ) : (
              chatMessages.map((message) => (
                message.type === "image" ? (
                  <article
                    className="chat-message chat-message--image chat-message--user"
                    key={message.id}
                  >
                    <img
                      className="chat-message__image"
                      src={message.image.imageUrl}
                      alt={message.image.filename}
                    />
                  </article>
                ) : (
                  <article
                    className={`chat-message chat-message--text ${
                      message.sender === "user"
                        ? "chat-message--user"
                        : "chat-message--bot"
                    }`}
                    key={message.id}
                  >
                    <div className="chat-message__body">
                      <p className="chat-message__meta">
                        {message.sender === "user"
                          ? "You"
                          : message.modelName ?? selectedChatModel}
                      </p>
                      <p className="chat-message__text">{message.text}</p>
                    </div>
                  </article>
                )
              ))
            )}
          </div>

          <form className="chat-composer" onSubmit={handleChatSubmit}>
            {pendingAttachment ? (
              <div className="chat-composer__attachment">
                <img
                  className="chat-composer__attachment-image"
                  src={pendingAttachment.imageUrl}
                  alt={pendingAttachment.filename}
                />
                <button
                  className="chat-composer__attachment-remove"
                  type="button"
                  onClick={handleRemoveAttachment}
                  aria-label="Remove attached image"
                  title="Remove attached image"
                >
                  x
                </button>
              </div>
            ) : null}
            <input
              id="chat-message-input"
              className="chat-composer__input"
              type="text"
              value={chatInput}
              onChange={(event) => setChatInput(event.target.value)}
              placeholder="Type a message..."
              aria-label="Chat message"
            />
            <div className="chat-composer__tools">
              <div className="chat-composer__tools-left">
                <select
                  id="chat-model-select"
                  className="chat-composer__select"
                  value={selectedChatModel}
                  onChange={(event) =>
                    setSelectedChatModel(event.target.value as ChatModelValue)
                  }
                  aria-label="Select model"
                  title="Select model"
                >
                  {CHAT_MODELS.map((model) => (
                    <option key={model.value} value={model.value}>
                      {model.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="chat-composer__tools-right">
                <input
                  ref={uploadInputRef}
                  className="chat-composer__upload-input"
                  type="file"
                  accept="image/*"
                  onChange={handleUploadChange}
                  tabIndex={-1}
                  aria-hidden="true"
                />
                <button
                  className="chat-composer__icon-button"
                  type="button"
                  onClick={handleUploadClick}
                  aria-label="Upload image"
                  title="Upload image"
                >
                  +
                </button>
                <button
                  className="chat-composer__icon-button"
                  type="button"
                  onClick={handleMicClick}
                  aria-label="Microphone input"
                  title="Microphone input"
                >
                  o
                </button>
              </div>
            </div>
          </form>
        </aside>
      ) : null}
    </main>
  );
}
