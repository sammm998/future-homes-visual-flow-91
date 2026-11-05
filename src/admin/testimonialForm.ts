export type TestimonialForm = {
  customer_name: string; customer_country: string; review_text: string;
  rating: string; image_url: string; location: string; property_type: string;
  designation: string; company_name: string; company_url: string;
};

export const emptyTestimonial: TestimonialForm = {
  customer_name: "", customer_country: "", review_text: "", rating: "5",
  image_url: "", location: "", property_type: "", designation: "",
  company_name: "", company_url: "",
};

export function testimonialPayload(form: TestimonialForm) {
  if (!form.customer_name.trim() || !form.review_text.trim()) throw new Error("Name and review required");
  const rating = Number(form.rating);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) throw new Error("Rating must be between 1 and 5");
  if (form.company_url && !/^https?:\/\//i.test(form.company_url)) throw new Error("Use an http or https company URL");
  if (form.image_url && !/^https?:\/\//i.test(form.image_url) && !form.image_url.startsWith("/api/public/media/")) throw new Error("Use an http or https image URL");
  return {
    customer_name: form.customer_name.trim(), review_text: form.review_text.trim(), rating,
    customer_country: form.customer_country.trim() || null,
    image_url: form.image_url.trim() || null, location: form.location.trim() || null,
    property_type: form.property_type.trim() || null, designation: form.designation.trim() || null,
    company_name: form.company_name.trim() || null, company_url: form.company_url.trim() || null,
    updated_at: new Date().toISOString(),
  };
}