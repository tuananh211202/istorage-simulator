import type { ImageItem } from "../types";

type ImageCardProps = {
  image: ImageItem;
  onViewDetails: (image: ImageItem) => void;
  onAddToChat: (image: ImageItem) => void;
};

export function ImageCard({
  image,
  onViewDetails,
  onAddToChat,
}: ImageCardProps) {
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
        <div className="image-card__actions">
          <button
            className="icon-action-button"
            onClick={() => onViewDetails(image)}
            type="button"
            aria-label={`View product details for ${image.filename}`}
            title="View product details"
          >
            i
          </button>
          <button
            className="icon-action-button icon-action-button--primary"
            onClick={() => onAddToChat(image)}
            type="button"
            aria-label={`Add ${image.filename} to chat`}
            title="Add image to chat"
          >
            +
          </button>
        </div>
      </div>
    </article>
  );
}
