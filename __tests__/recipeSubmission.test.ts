import { describe, expect, it } from "vitest";
import { shouldUploadRecipeImage } from "../utils/recipeSubmission";

describe("shouldUploadRecipeImage", () => {
  it("returns false for empty or existing URL values", () => {
    expect(shouldUploadRecipeImage(undefined)).toBe(false);
    expect(shouldUploadRecipeImage("")).toBe(false);
    expect(shouldUploadRecipeImage("https://example.com/image.png")).toBe(false);
  });

  it("returns true for a File instance", () => {
    const file = new File(["image"], "recipe.png", { type: "image/png" });

    expect(shouldUploadRecipeImage(file)).toBe(true);
  });
});
