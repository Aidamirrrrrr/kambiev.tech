/** Английский словарь. Проверяется на совпадение с формой русского. */

import type { Dictionary } from "./types";

export const en: Dictionary = {
  ui: {
    more: "Details",
    less: "Collapse",
    whatInside: "What's inside",
    privacy: "Privacy policy",
    consent:
      "By sending this form you agree to the processing of the data you entered.",
    shotApp: "App",
    shotMiniApp: "Mini App",
    shotCatalog: "Catalogue",
    shotCard: "Product page",
    showAll: "Show the full stack",
    hideAll: "Collapse the stack",
  },
  nav: {
    wordmark: "Aidamir Kambiev",
    about: "About",
    experience: "Experience",
    work: "Work",
    stack: "Stack",
    contact: "Contact",
    cta: "Get in touch",
  },
  hero: {
    label: "Fullstack Developer",
    place: "Saint Petersburg / remote",
    line1: "Aidamir",
    line2: "Kambiev",
    tagline:
      "I build digital products end to end, from the server to the screen in your hand.",
    now: "VELIZHANIN · since December 2025",
    cta: "View projects",
  },
  about: {
    label: "About me",
    title: "I build products",
    titleAccent: "end to end",
    text1:
      "Fullstack developer with four years of commercial experience. I own the product end to end: architecture and database design, REST APIs, backend and frontend, third-party integrations, job queues, CI/CD, deployment and production support.",
    text2:
      "I've worked on payment systems, Telegram Mini Apps, SSR applications and heavily integrated backend services. I run code reviews, mentored three junior developers and introduced engineering standards. My own product reached 2,000+ users with a paying audience.",
    cap1t: "Backend and data",
    cap1d:
      "REST APIs on NestJS, PostgreSQL schemas, job queues, integrations and payments.",
    cap2t: "Interfaces",
    cap2d:
      "React and Next.js, SSR, Telegram Mini Apps. Took a native iOS app all the way to an App Store release.",
    cap3t: "Infrastructure",
    cap3d:
      "Docker, CI/CD on GitHub Actions, deployment and production support.",
    stat1: "years of commercial experience",
    stat2: "products shipped end to end",
    stat3: "users on my own product",
    stat4: "juniors mentored",
  },
  experience: {
    label: "Experience",
    title: "Where I've",
    titleAccent: "worked",
    now: "Present",
    stackLabel: "Stack",
    e1: {
      company: "VELIZHANIN",
      role: "Fullstack Developer",
      plain:
        "Building the brand's whole product platform: server, mobile apps and bots.",
      period: "December 2025 – Present",
      summary:
        "A platform for Telegram channel authors: content management, scheduled publishing and AI features.",
      b1: "Designed and built a NestJS REST API from scratch as domain modules: post catalog, JWT auth through Telegram Mini App, S3 media via presigned upload, asynchronous publishing on BullMQ and Redis, AI headline generation.",
      b2: "Built the client applications on a shared API: two Telegram Mini Apps, a native iOS app in SwiftUI, an Android client and Telegram bots on Grammy.",
      b3: "Set up a pnpm and Turborepo monorepo with shared packages for security guards, HTTP bootstrap, health probes and S3. Wiring up a new app takes hours instead of days.",
      b4: "Configured CI/CD on GitHub Actions: lint, typecheck, unit and e2e tests, build and automatic deployment. Regressions surface before merge; releases need no manual deploy.",
      stack:
        "TypeScript · NestJS · Prisma · PostgreSQL · Redis · BullMQ · React 19 · Vite · TanStack Query · SwiftUI · Kotlin · Grammy · S3 · Docker · Turborepo · GitHub Actions",
    },
    e2: {
      company: "NeonVPN, my own product",
      role: "Fullstack Developer",
      plain:
        "My own product: launched a subscription VPN and grew it to two thousand paying users.",
      period: "January 2026 – April 2026",
      summary:
        "A subscription service I built and launched on my own: architecture, backend, frontend, payments, infrastructure and production support.",
      b1: "A Telegram bot and Telegram Mini App as the main user interface.",
      b2: "Billing through YooKassa: subscriptions, auto-renewal and plan changes.",
      b3: "Automated provisioning and revocation of user access, plus an admin panel with analytics.",
      b4: "Grew the product to 2,000+ users with a paying audience. The project is now closed.",
      stack:
        "TypeScript · NestJS · Prisma · PostgreSQL · Telegram Mini Apps · Grammy · YooKassa · Docker",
    },
    e3: {
      company: "FlowAi",
      role: "Frontend Developer",
      plain: "Owned the interface of an AI platform and how fast it felt.",
      period: "April 2024 – February 2025",
      summary:
        "The client side of an AI platform with SSR and WebSocket infrastructure.",
      b1: "Built the frontend architecture on Feature-Sliced Design and implemented SSR with cache invalidation. New sections plug in without rewriting existing modules.",
      b2: "Built a chat interface that streams the model's response over WebSocket: text appears as it is generated, with no wait for the full answer.",
      b3: "Built an admin panel for generating dynamic pages and a user area with audio upload and validation.",
      b4: "Set up access/refresh token auth in httpOnly cookies, plus ESLint and Husky for commit quality. Scrum, two-week sprints, peer code review.",
      stack:
        "Next.js · React · TypeScript · Redux Toolkit · RTK Query · React Hook Form · Ant Design · WebSocket · SSR · FSD · SCSS · GitLab CI",
    },
    e4: {
      company: "Freelance / project work",
      role: "Fullstack Developer",
      plain:
        "Shipped end-to-end products for a range of clients and mentored juniors.",
      period: "September 2022 – December 2025",
      summary:
        "Shipped 10+ commercial products end to end: from architecture, REST API and database design through frontend/backend development, CI/CD, deployment and production support.",
      b1: "Ran code reviews and mentored three junior developers.",
      b2: "Introduced shared code standards and a common CI template. PR review time dropped from 2–3 days to a few hours.",
      b3: "Products included Telegram sales funnels, fintech interfaces, Telegram Mini Apps, and integrations with iiko, Bitrix24, GetCourse and YooKassa.",
      b4: "Promo sites scoring 100/100 in Google Lighthouse across Performance, Accessibility, Best Practices and SEO.",
      stack:
        "TypeScript · NestJS · Next.js · Vue.js · Pinia · Prisma · Drizzle · PostgreSQL · Bun · Python · FastAPI · S3/MinIO · Docker · GitHub Actions",
    },
  },
  projects: {
    label: "Selected work",
    title: "What I've",
    titleAccent: "built",
    cta: "Discuss a project",
    moreTitle: "Other projects",
    p1facts: [
      "An API of five domain modules",
      "Queues and content delivery",
      "Admin panel with analytics",
    ],
    p1short:
      "Channel navigation with post viewing inside Telegram, a separate app, and an admin panel with analytics. All running on one API.",
    p1cat: "Product platform",
    p1desc:
      "A NestJS API of five domain modules on a shared PostgreSQL: a post catalogue, auth through the Telegram Mini App, media in S3, and asynchronous content delivery over BullMQ and Redis queues, served per platform. On top of the API: a Telegram Mini App for channel navigation and reading posts, a separate client app, and an admin panel for management and analytics. All in a pnpm and Turborepo monorepo.",
    p2facts: [
      "2,000+ paying users",
      "7 services",
      "Payments with auto-renewal",
    ],
    p2short:
      "My own subscription VPN, taken from an idea to two thousand paying users.",
    p2cat: "My own product",
    p2desc:
      "A subscription VPN service across seven services: user and admin APIs, bot, Mini App, payments, scheduler and site. YooKassa billing with auto-renewal and automated access provisioning. 2,000+ users with a paying audience.",
    p3facts: [
      "Answers stream as they are generated",
      "New sections without rewrites",
      "Pages generated from the admin panel",
    ],
    p3short:
      "The client side of an AI platform: a chat that streams the model's answer as it is generated, an admin panel and a client cabinet.",
    p3cat: "AI platform",
    p3desc:
      "Frontend architecture on Feature-Sliced Design with SSR and cache invalidation: new sections plug in without rewriting existing modules. A chat interface streaming the model's answers over WebSocket, so text appears as it is generated rather than after the full response. An admin panel for generating dynamic pages and a client cabinet with audio upload and validation. Auth on access/refresh tokens in httpOnly cookies.",
    p4facts: [
      "Funnels without a developer",
      "Bitrix24 and GetCourse",
      "Recurring payments",
    ],
    p4short:
      "Selling access to a private club through Telegram. The client changes the sales flow without a developer.",
    p4cat: "Telegram / integrations",
    p4desc:
      "A Telegram product selling access to a private club: configurable sales funnels with a visual graph editor, plus Bitrix24, GetCourse and YooKassa integrations with recurring payments. The client changes sales scenarios without a developer.",
    p5cat: "School site",
    p5short:
      "The site of an online Chinese language school. A trial-lesson request goes straight into the teachers' working chat.",
    p5facts: [
      "Requests land in Telegram",
      "Five sections on one page",
      "Built for search",
    ],
    p5desc:
      "A single-page Next.js site: who it suits, study formats, teachers and contacts. Trial-lesson requests are sent by a Telegram bot into the school's working group. Sitemap, robots and metadata for search, plus separate privacy and cookie pages.",
    p6cat: "Promo site",
    p6short:
      "An interior floristry studio: a website and a bouquet shop inside Telegram. Catalogue, cart and checkout in both.",
    p6facts: [
      "A website and a Telegram Mini App",
      "Catalogue, cart and checkout",
      "100/100 in Google Lighthouse",
    ],
    p6desc:
      "An Awwwards-style promo site on Next.js: responsive layout, animations and 100/100 in Google Lighthouse across Performance, Accessibility, Best Practices and SEO. Alongside it a bouquet shop as a Telegram Mini App: a searchable catalogue with categories, product pages, cart and YooKassa checkout, plus an admin panel for products and orders.",
    p7cat: "Pet project",
    p7short:
      "A VS Code extension that turns a local model into a coding agent. Nothing leaves the machine, and every edit is shown before it lands.",
    p7facts: [
      "The model runs on your own machine",
      "Every write is shown before it lands",
      "Two modes: asking and editing",
    ],
    p7desc:
      "A VS Code extension on top of Ollama: the model runs locally and nothing leaves the machine. Two modes: Ask answers questions about the code with read-only tools, Agent edits files and runs commands. The premise is that a small local model will not follow instructions reliably, so the discipline is built into the tool rather than requested in the prompt: writes are shown as a diff before they happen and destructive commands are confirmed whatever the settings say. Plus subagents, your own agents, image support and context management.",
    m1name: "InSpay",
    m1desc:
      "A fintech platform on Vue.js: refactored the legacy frontend, moved the codebase to TypeScript, lifted state into Pinia. Time to ship new functionality dropped from 2–3 weeks to 2–3 days.",
    m2name: "MonteMove",
    m2desc:
      "A personal finance platform: a Next.js frontend with complex forms and validation, backend work in Python and FastAPI, and financial data parsers. Automated data collection that had been done by hand.",
    m3name: "ALEVROLLS",
    m3desc:
      "A food delivery service on Next.js integrated with the iiko Cloud API: menu and orders from the accounting system, Telegram auth, a persistent cart and order history.",
    m5name: "MOSK: bot and admin panel",
    m5desc:
      "Intake and moderation of event submissions for a Telegram channel: a Grammy and Bun bot for submitting, a Next.js admin panel for moderation, and YooKassa payments for publication. The whole path from submission to publication is automated.",
  },
  stack: {
    label: "Stack",
    title: "Technologies I",
    titleAccent: "trust",
    frontend: "Frontend",
    backend: "Backend",
    tools: "Tools",
    infra: "Infrastructure",
  },
  ctaBanner: {
    label: "Working together",
    title: "Let's",
    titleAccent: "work together",
    text: "Open to job offers and to project work: product development, architecture, getting a project to production. I reply within a day.",
    cta: "Get in touch",
    stat1val: "24h",
    stat1label: "response time",
    stat2val: "RU / EN",
    stat2label: "languages",
    stat3val: "SPB",
    stat3label: "or remote",
  },
  contact: {
    label: "Get in touch",
    title: "Tell me about",
    titleAccent: "the problem",
    text: "The form goes straight to my Telegram, and I'll reply from there. Or reach me directly, by DM or email.",
    nameLabel: "Name",
    contactLabel: "Email, Telegram or phone",
    contactHint: "For example: ivan@mail.ru, @ivan or +7 (999) 123-45-67",
    errName: "Tell me what to call you",
    errContact: "Say where to reply",
    errContactInvalid:
      "Looks like a typo: an email, an @handle or a full phone number",
    errMessage: "Write a couple of words about the project",
    sentTitle: "Message sent",
    sentText: "It is already in my Telegram. I will reply within a day.",
    sendMore: "Send another",
    messageLabel: "Tell me about the project...",
    send: "Send message",
    sending: "Sending...",
    sent: "Sent ✓",
    error: "Error, try again",
  },
  footer: {
    rights: "All rights reserved.",
  },
};
