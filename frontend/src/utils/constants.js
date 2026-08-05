export const DEFAULT_CAR_IMAGE =
  "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80";

export const getCarImageUrl = (car) => {
  if (!car) return DEFAULT_CAR_IMAGE;
  const url =
    car.image ||
    car.imageUrl ||
    car.img ||
    (Array.isArray(car.images) && car.images[0]);
  if (!url || typeof url !== "string" || !url.trim()) {
    return DEFAULT_CAR_IMAGE;
  }
  return url.trim();
};

export const handleImageError = (e) => {
  if (e && e.target && e.target.src !== DEFAULT_CAR_IMAGE) {
    e.target.onerror = null; // Prevent infinite loop if fallback fails
    e.target.src = DEFAULT_CAR_IMAGE;
  }
};
