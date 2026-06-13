export interface Region {
  slug: "kakheti" | "kazbegi" | "tbilisi";
  name: string;
  subtitle: string;
  routeHint: string;
  href: string;
  alt: string;
  blurDataURL: string;
}

export const regions: Region[] = [
  {
    slug: "tbilisi",
    name: "Tbilisi",
    subtitle: "Old Town & Hidden Courtyards",
    routeHint: "4 missions · Free starter quest available",
    href: "/tours/tbilisi-city-quest",
    alt: "Ornate tiled facade and carved wooden balconies of Old Tbilisi's Abanotubani sulfur bath district",
    blurDataURL:
      "data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAMABADASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAQQFBv/EABwQAAICAwEBAAAAAAAAAAAAAAECAyEABBESMf/EABUBAQEAAAAAAAAAAAAAAAAAAAAC/8QAFhEBAQEAAAAAAAAAAAAAAAAAAAFR/9oADAMBAAIRAxEAPwBVGijnR15yiRlLa2lRIRruo5EQ3PovMms8hNmxhfal9EezeVZg/9k=",
  },
  {
    slug: "kakheti",
    name: "Kakheti",
    subtitle: "Wine Country & Golden Hills",
    routeHint: "5 missions · 8,000 years of winemaking",
    href: "/tours/kakheti-wine-legends",
    alt: "Hilltop town of Sighnaghi overlooking the Alazani Valley vineyards in Kakheti, Georgia",
    blurDataURL:
      "data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAMABADASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAAIEBf/EACEQAAICAAUFAAAAAAAAAAAAAAECAAQDERMxkQUhMkKC/8QAFQEBAQAAAAAAAAAAAAAAAAAAAgP/xAAYEQACAwAAAAAAAAAAAAAAAAAAAQISE//aAAwDAQACEQMRAD8AiShSPlbT5UmDVOnamSWWCjLuyb8TE18U+7cxRiMG3MrrIFEf/9k=",
  },
  {
    slug: "kazbegi",
    name: "Kazbegi",
    subtitle: "Mountain Pass & Sacred Peaks",
    routeHint: "4 missions · 2,170m above the clouds",
    href: "/tours/kazbegi-mountain-quest",
    alt: "Gergeti Trinity Church above the clouds with the snow-capped peak of Mount Kazbek behind it",
    blurDataURL:
      "data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAMABADASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAgQG/8QAHxAAAQMEAwEAAAAAAAAAAAAAAQIDEQAEEhMUITFR/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAL/xAAVEQEBAAAAAAAAAAAAAAAAAAAAEf/aAAwDAQACEQMRAD8AlttRCd9p70AHUiaLz7CMkpsFAHw7AYrPZqJkkyKfKd6BVMfRV0f/2Q==",
  },
];
