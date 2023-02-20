import { Photo } from "../../types/shared";

export const getRequiredPhotos = (photos: Photo[]) => {
  const length = photos.length;

  if (length) {
    return [photos[0], photos[length - 1]].map((photo) => ({
      height: photo?.height,
      width: photo?.width,
      value: photo?.value,
    }));
  }

  return [];
};
