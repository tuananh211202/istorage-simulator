import type { FetchImagesParams, ImagesResponse } from "../types";

const DEFAULT_LIMIT = 10;
const DEFAULT_PAGE = 1;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

function buildQuery(params: FetchImagesParams) {
  const query = new URLSearchParams();

  const search = params.search?.trim() ?? "";
  const page = params.page ?? DEFAULT_PAGE;
  const limit = params.limit ?? DEFAULT_LIMIT;

  if (search.length > 0) {
    query.set("search", search);
  }

  query.set("page", String(page));
  query.set("limit", String(limit));

  return query.toString();
}

export async function fetchImages(
  params: FetchImagesParams = {},
): Promise<ImagesResponse> {
  const query = buildQuery(params);
  const response = await fetch(`${API_BASE_URL}/api/images?${query}`, {
    cache: "no-store",
    headers: {
      Accept: "application/json",
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
    },
  });

  if (!response.ok) {
    try {
      throw await response.json();
    } catch {
      throw {
        error: {
          code: "API_ERROR",
          message: "Unable to fetch images.",
        },
      };
    }
  }

  return response.json() as Promise<ImagesResponse>;
}
