import { describe, expect, it } from "vitest";
import { emptyTestimonial, testimonialPayload } from "../src/admin/testimonialForm";

describe("CMS testimonial data", () => {
  it("requires a customer name and real review text", () => {
    expect(() => testimonialPayload({ ...emptyTestimonial, review_text: "Review" })).toThrow();
    expect(() => testimonialPayload({ ...emptyTestimonial, customer_name: "Customer", review_text: " " })).toThrow();
  });
  it("retains the customer's uploaded photo when editing", () => {
    const result = testimonialPayload({ ...emptyTestimonial, customer_name: " Customer ", review_text: " Review ", image_url: "/api/public/media/testimonials/photo.jpg" });
    expect(result.image_url).toBe("/api/public/media/testimonials/photo.jpg");
    expect(result.customer_name).toBe("Customer");
    expect(result.review_text).toBe("Review");
  });
  it("rejects executable image links", () => {
    expect(() => testimonialPayload({ ...emptyTestimonial, customer_name: "Customer", review_text: "Review", image_url: "javascript:alert(1)" })).toThrow();
  });
});