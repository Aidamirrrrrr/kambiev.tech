import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { cookies } from "next/headers";
import { site } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin", "cyrillic"],
});

const SITE = site.url;
const TITLE = site.title;
const DESCRIPTION =
  "Fullstack-разработчик с четырьмя годами коммерческого опыта. Проектирую архитектуру и схему базы, пишу бэкенд и фронтенд, делаю интеграции и платежи, довожу продукт через CI/CD до продакшена. TypeScript, NestJS, React, Next.js, PostgreSQL.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: TITLE,
    template: "%s | Aidamir Kambiev",
  },
  description: DESCRIPTION,
  applicationName: site.domain,
  category: "technology",
  keywords: [
    "fullstack-разработчик",
    "fullstack engineer",
    "backend-разработчик",
    "frontend-разработчик",
    "TypeScript",
    "NestJS",
    "React",
    "Next.js",
    "PostgreSQL",
    "Prisma",
    "Telegram Mini Apps",
    "разработка под ключ",
    "Санкт-Петербург",
    "Aidamir Kambiev",
    "Айдамир Камбиев",
  ],
  authors: [{ name: "Aidamir Kambiev", url: SITE }],
  creator: "Aidamir Kambiev",
  publisher: "Aidamir Kambiev",
  // Телефон в резюме есть, но на сайте он не публикуется, поэтому автоматическое
  // определение номеров Safari только мешает.
  formatDetection: { telephone: false, email: false, address: false },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE,
    siteName: "Aidamir Kambiev",
    locale: "ru_RU",
    alternateLocale: "en_US",
    type: "profile",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Aidamir Kambiev, fullstack-разработчик",
      },
    ],
    firstName: "Aidamir",
    lastName: "Kambiev",
    username: "Aidamirrrrrr",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE,
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-icon.png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#ffffff" },
  ],
  colorScheme: "light",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const lang = cookieStore.get("locale")?.value === "en" ? "en" : "ru";

  // Всё в одном графе, чтобы поисковик связал сущности между собой,
  // а не читал три независимых куска.
  const person = {
    "@type": "Person",
    "@id": `${SITE}/#person`,
    name: lang === "en" ? site.name : site.nameRu,
    alternateName: lang === "en" ? site.nameRu : site.name,
    url: SITE,
    email: site.email,
    jobTitle: site.jobTitle,
    description: DESCRIPTION,
    address: {
      "@type": "PostalAddress",
      addressLocality: site.city,
      addressCountry: site.countryCode,
    },
    sameAs: [site.telegram],
    knowsLanguage: [
      { "@type": "Language", name: "Russian" },
      { "@type": "Language", name: "English" },
    ],
    hasOccupation: {
      "@type": "Occupation",
      name: site.jobTitle,
      occupationLocation: { "@type": "City", name: site.city },
      skills:
        "TypeScript, Node.js, NestJS, React, Next.js, PostgreSQL, Prisma, Redis, BullMQ, Docker, CI/CD, Telegram Mini Apps",
    },
    knowsAbout: [
      "TypeScript",
      "Node.js",
      "NestJS",
      "React",
      "Next.js",
      "PostgreSQL",
      "Prisma",
      "Redis",
      "BullMQ",
      "REST API",
      "Docker",
      "GitHub Actions",
      "CI/CD",
      "Telegram Mini Apps",
      "WebSocket",
      "Server-Side Rendering",
    ],
  };

  const works = [
    [
      "VELIZHANIN Platform",
      "Продуктовая платформа для авторов Telegram-каналов",
    ],
    ["FlowAi", "Клиентская часть AI-платформы"],
    [
      "Global Dent Club",
      "Telegram-продукт для продажи доступа в закрытый клуб",
    ],
    ["ELEMENT Concept", "Сайт и Telegram Mini App студии флористики"],
    ["NeonVPN", "Собственный подписочный VPN-сервис"],
    ["Red Dragon Way", "Сайт онлайн-школы китайского языка"],
    ["Keel", "Расширение для VS Code с локальной моделью"],
  ].map(([name, description], i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "CreativeWork",
      name,
      description,
      creator: { "@id": `${SITE}/#person` },
    },
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      person,
      {
        "@type": "WebSite",
        "@id": `${SITE}/#website`,
        url: SITE,
        name: site.domain,
        description: DESCRIPTION,
        inLanguage: lang === "en" ? "en" : "ru",
        publisher: { "@id": `${SITE}/#person` },
      },
      {
        "@type": "ProfilePage",
        "@id": `${SITE}/#page`,
        url: SITE,
        name: TITLE,
        isPartOf: { "@id": `${SITE}/#website` },
        about: { "@id": `${SITE}/#person` },
        inLanguage: lang === "en" ? "en" : "ru",
      },
      {
        "@type": "ItemList",
        "@id": `${SITE}/#work`,
        name: "Проекты",
        itemListElement: works,
      },
    ],
  };

  return (
    <html lang={lang} suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        {/*
          JSON-LD нельзя вставить текстовым узлом: React экранировал бы кавычки
          и разметка перестала бы читаться. Содержимое собирается здесь же
          из констант, пользовательского ввода в нём нет.
        */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
