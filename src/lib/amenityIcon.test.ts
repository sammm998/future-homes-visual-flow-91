import { describe, it, expect } from "vitest";
import { Dumbbell, Car, Waves, CheckCircle } from "lucide-react";
import { amenityIcon } from "./amenityIcon";
describe("amenityIcon", () => {
  it("gym gets dumbbell", () => expect(amenityIcon("Fitness Center")).toBe(Dumbbell));
  it("parking gets car", () => expect(amenityIcon("Covered Parking")).toBe(Car));
  it("pool gets waves", () => expect(amenityIcon("Outdoor Swimming Pool")).toBe(Waves));
  it("unknown gets check", () => expect(amenityIcon("Something odd")).toBe(CheckCircle));
});
