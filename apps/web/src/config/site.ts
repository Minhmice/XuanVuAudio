/** Public site metadata and navigation defaults (no secrets). */
export const siteConfig = {
  name: "Xuan Vu Audio",
  description:
    "Xuan Vu Audio delivers engineered sensory experiences through precision-tuned audio instruments and transparent soundstage design.",
  defaultLocale: "vi" as const,
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
} as const;
