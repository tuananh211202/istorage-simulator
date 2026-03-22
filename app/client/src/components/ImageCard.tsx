import type { ImageItem } from "../types";

type ImageCardProps = {
  image: ImageItem;
};

export function ImageCard({ image }: ImageCardProps) {
  return (
    <article className="image-card">
      <div className="image-card__media">
        <img
          className="image-card__image"
          src={image.imageUrl}
          alt={image.filename}
        />
      </div>
      <div className="image-card__body">
        <h2 className="image-card__title">{image.filename}</h2>
      </div>
    </article>
  );
}
