import type { ImageItem } from "../types";
import { ImageCard } from "./ImageCard";

type ImageGridProps = {
  images: ImageItem[];
};

export function ImageGrid({ images }: ImageGridProps) {
  return (
    <section className="image-grid" aria-live="polite">
      {images.map((image) => (
        <ImageCard key={image.id} image={image} />
      ))}
    </section>
  );
}
