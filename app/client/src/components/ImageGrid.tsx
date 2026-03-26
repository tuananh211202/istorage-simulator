import type { ImageItem } from "../types";
import { ImageCard } from "./ImageCard";

type ImageGridProps = {
  images: ImageItem[];
  onViewDetails: (image: ImageItem) => void;
  onAddToChat: (image: ImageItem) => void;
};

export function ImageGrid({
  images,
  onViewDetails,
  onAddToChat,
}: ImageGridProps) {
  return (
    <section className="image-grid" aria-live="polite">
      {images.map((image) => (
        <ImageCard
          key={image.id}
          image={image}
          onViewDetails={onViewDetails}
          onAddToChat={onAddToChat}
        />
      ))}
    </section>
  );
}
