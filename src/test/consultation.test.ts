import { describe, expect, it } from "vitest";
import { getRecommendations } from "@/data/consultation";
import { getProduct, priceLabel } from "@/data/products";
import { ritualMessage, waLink } from "@/lib/whatsapp";

const names = (focus: Parameters<typeof getRecommendations>[0]) =>
  getRecommendations(focus, "simple").products.map((p) => p.name);

describe("consultation mapping", () => {
  it("clearer-looking skin suggests the kit and tea tree scrub", () => {
    expect(names("clear")).toEqual(["Anti-Pimples & Spots Kit", "Tea Tree Facial Scrub"]);
  });

  it("a soft, glowing body suggests body lotion, shower gel and caramel mini kit", () => {
    expect(names("body")).toEqual(["Body Lotion", "Shower Gel", "Caramel Mini Kit"]);
  });

  it("stretch marks suggests the glow oil placeholder and body lotion", () => {
    expect(names("stretch")).toEqual(["Glow Oil & Stretch Mark Cream", "Body Lotion"]);
  });

  it("a full ritual suggests face cream, body lotion and caramel mini kit", () => {
    expect(names("full")).toEqual(["Face Cream", "Body Lotion", "Caramel Mini Kit"]);
  });

  it("routine pace only changes the order and intro, not the products", () => {
    const simple = getRecommendations("body", "simple");
    const slow = getRecommendations("body", "indulgent");
    expect(slow.products.map((p) => p.id)).toEqual([...simple.products.map((p) => p.id)].reverse());
    expect(slow.intro).not.toEqual(simple.intro);
  });
});

describe("prices", () => {
  it("only the Anti-Pimples & Spots Kit has a price (₦40,000)", () => {
    expect(priceLabel(getProduct("anti-pimples-kit")!)).toBe("₦40,000");
    expect(priceLabel(getProduct("face-cream")!)).toBe("Price on request");
  });
});

describe("WhatsApp", () => {
  it("opens wa.me/2347036772596 with the ritual items prefilled", () => {
    expect(waLink(ritualMessage(["Face Cream", "Body Lotion"]))).toBe(
      "https://wa.me/2347036772596?text=" +
        encodeURIComponent("Hello Cheyness Empire, I'd like to ask about: Face Cream, Body Lotion."),
    );
  });
});
