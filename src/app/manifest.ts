import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.title,
    short_name: site.domain,
    description:
      "Портфолио fullstack-разработчика: продуктовые платформы, Telegram Mini Apps, интеграции и платежи.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    lang: "ru",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/logo-icon.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
