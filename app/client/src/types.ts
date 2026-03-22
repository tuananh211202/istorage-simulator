export type ImageItem = {
  id: string;
  filename: string;
  imageUrl: string;
};

export type Pagination = {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasMore: boolean;
};

export type ImagesResponse = {
  items: ImageItem[];
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasMore: boolean;
};

export type ApiErrorResponse = {
  error: {
    code: string;
    message: string;
  };
};

export type FetchImagesParams = {
  search?: string;
  page?: number;
  limit?: number;
};
