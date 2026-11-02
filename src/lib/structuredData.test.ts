import { describe, it, expect } from "vitest";
import { tours } from "@/data/tours";
import { FAQ_EN } from "@/data/faq";
import { faqJsonLd, organizationJsonLd, serializeJsonLd, tourJsonLd } from "./structuredData";
import { buildLlmsTxt } from "./llmsTxt";

const kazbegi = tours.find((t) => t.slug === "kazbegi-mountain-quest")!;
const batumi = tours.find((t) => t.pricePerPersonGel == null)!;
const inWinter = new Date("2026-11-15T12:00:00Z");
const inSummer = new Date("2027-06-15T12:00:00Z");

describe("structured data", () => {
  it("describes IVERA as a travel agency in Tbilisi", () => {
    const org = organizationJsonLd();
    expect(org["@type"]).toBe("TravelAgency");
    expect(org.url).toBe("https://www.ivera.info");
  });

  it("gives each tour its seasonal price in GEL while the offer runs", () => {
    const winter = tourJsonLd(kazbegi, inWinter);
    expect(winter.offers).toMatchObject({ price: 78, priceCurrency: "GEL", priceValidUntil: "2027-02-28" });
    const summer = tourJsonLd(kazbegi, inSummer);
    expect(summer.offers).toMatchObject({ price: 130 });
    expect(summer.offers).not.toHaveProperty("priceValidUntil");
  });

  it("leaves out the offer for tours priced on request", () => {
    expect(tourJsonLd(batumi, inWinter)).not.toHaveProperty("offers");
  });

  it("turns the FAQ into questions and answers", () => {
    const faq = faqJsonLd(FAQ_EN);
    expect(faq.mainEntity).toHaveLength(FAQ_EN.length);
  });

  it("escapes < so data can never close the script tag", () => {
    expect(serializeJsonLd({ name: "</script><b>" })).not.toContain("</script>");
  });
});

describe("llms.txt", () => {
  it("lists every tour with today's price and the offer", () => {
    const text = buildLlmsTxt(inWinter);
    expect(text).toContain("78 GEL per person (usually 130 GEL)");
    expect(text).toContain("40% off all group tours until 2027-02-28");
    for (const tour of tours) expect(text).toContain(`/tours/${tour.slug}`);
  });

  it("drops the offer when it has ended", () => {
    const text = buildLlmsTxt(inSummer);
    expect(text).toContain("130 GEL per person");
    expect(text).not.toContain("% off");
  });
});
