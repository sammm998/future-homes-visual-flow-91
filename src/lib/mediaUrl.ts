/** Public URL for a file uploaded to the property-images bucket. */
export const mediaUrl = (path: string) =>
  `${typeof window !== "undefined" ? window.location.origin : "https://futurehomesinternational.com"}/api/public/media/${path.split("/").map(encodeURIComponent).join("/")}`;
