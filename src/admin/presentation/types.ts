export type SlideLayout =
  | "cover"
  | "image-full"
  | "image-text"
  | "gallery"
  | "specs"
  | "text"
  | "closing";

export interface SlideSpec {
  label: string;
  value: string;
}

export interface Slide {
  id: string;
  layout: SlideLayout;
  title?: string;
  subtitle?: string;
  body?: string;
  image?: string;
  images?: string[];
  specs?: SlideSpec[];
  textColor?: string;
}

export interface PresentationTheme {
  primary: string; // main dark brand colour
  accent: string; // gold accent
}

export const DEFAULT_THEME: PresentationTheme = {
  primary: "#1c1c1c",
  accent: "#c9a24b",
};

export const SLIDE_W = 1280;
export const SLIDE_H = 720;

let counter = 0;
export const newId = () =>
  `s_${Date.now().toString(36)}_${(counter++).toString(36)}`;

export const blankSlide = (layout: SlideLayout = "text"): Slide => ({
  id: newId(),
  layout,
  title: layout === "cover" ? "Presentation title" : "Slide title",
  subtitle: "",
  body: layout === "text" ? "Add your text here…" : "",
  images: [],
  specs: [],
});

export interface PropertyForSlides {
  id: string;
  title: string;
  location: string;
  price?: string | null;
  price_currency?: string | null;
  description?: string | null;
  property_image?: string | null;
  property_images?: string[] | null;
  bedrooms?: string | null;
  bathrooms?: string | null;
  sizes_m2?: string | null;
  property_type?: string | null;
  property_district?: string | null;
  distance_to_beach_km?: string | null;
  distance_to_airport_km?: string | null;
  ref_no?: string | null;
  roi_percent?: number | null;
}

const clean = (html?: string | null) =>
  (html || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

export function generateSlidesFromProperty(p: PropertyForSlides): Slide[] {
  const images = (p.property_images || []).filter(Boolean);
  const main = p.property_image || images[0] || "";
  const currency = p.price_currency || "EUR";
  const priceStr = p.price ? `${p.price} ${currency}` : "";
  const desc = clean(p.description);

  const slides: Slide[] = [];

  slides.push({
    id: newId(),
    layout: "cover",
    title: p.title,
    subtitle: [p.property_district, p.location].filter(Boolean).join(", "),
    body: priceStr,
    image: main,
  });

  if (main) {
    slides.push({
      id: newId(),
      layout: "image-full",
      title: p.title,
      subtitle: p.location,
      image: main,
    });
  }

  const specs: SlideSpec[] = [];
  if (p.property_type) specs.push({ label: "Type", value: p.property_type });
  if (p.bedrooms) specs.push({ label: "Bedrooms", value: p.bedrooms });
  if (p.bathrooms) specs.push({ label: "Bathrooms", value: p.bathrooms });
  if (p.sizes_m2) specs.push({ label: "Size", value: `${p.sizes_m2} m²` });
  if (priceStr) specs.push({ label: "Price", value: priceStr });
  if (p.distance_to_beach_km)
    specs.push({ label: "To beach", value: `${p.distance_to_beach_km} km` });
  if (p.distance_to_airport_km)
    specs.push({ label: "To airport", value: `${p.distance_to_airport_km} km` });
  if (p.roi_percent) specs.push({ label: "ROI", value: `${p.roi_percent}%` });
  if (p.ref_no) specs.push({ label: "Reference", value: p.ref_no });

  if (specs.length) {
    slides.push({
      id: newId(),
      layout: "specs",
      title: "Key facts",
      subtitle: p.title,
      specs,
    });
  }

  if (desc) {
    slides.push({
      id: newId(),
      layout: "image-text",
      title: "About this property",
      body: desc.slice(0, 900),
      image: images[1] || main,
    });
  }

  if (images.length > 1) {
    slides.push({
      id: newId(),
      layout: "gallery",
      title: "Gallery",
      images: images.slice(0, 6),
    });
  }

  slides.push({
    id: newId(),
    layout: "closing",
    title: "Future Homes International",
    subtitle: "Your trusted partner in international real estate",
    body: "info@futurehomesinternational.com · www.futurehomesinternational.com",
  });

  return slides;
}
