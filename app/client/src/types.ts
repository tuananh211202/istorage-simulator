export type ImageItem = {
  id: string;
  filename: string;
  imageUrl: string;
};

export type ImageChatMessage = {
  id: string;
  type: "image";
  sender: "user";
  image: ImageItem;
  createdAt: string;
};

export type TextChatMessage = {
  id: string;
  type: "text";
  sender: "user" | "bot";
  text: string;
  createdAt: string;
  modelName?: string;
};

export type ChatMessage = ImageChatMessage | TextChatMessage;

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
