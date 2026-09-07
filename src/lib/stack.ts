/**
 * Технологический стек: данные отдельно от секции.
 *
 * Список правится чаще, чем вёрстка, и держать двести пятьдесят строк
 * данных внутри компонента неудобно: правка одного названия заставляла
 * открывать файл с разметкой.
 */

export type TechItem = {
  name: string;
  detail: string;
  url: string;
  featured?: boolean;
};

export const techCategories = [
  {
    key: "frontend" as const,
    items: [
      {
        name: "React",
        detail: "UI Library",
        url: "https://react.dev",
        featured: true,
      },
      {
        name: "Next.js",
        detail: "Meta-Framework",
        url: "https://nextjs.org",
        featured: true,
      },
      {
        name: "TypeScript",
        detail: "Type-safe JS",
        url: "https://typescriptlang.org",
        featured: true,
      },
      {
        name: "Vue.js",
        detail: "Progressive Framework",
        url: "https://vuejs.org",
      },
      {
        name: "Tailwind CSS",
        detail: "Utility-First CSS",
        url: "https://tailwindcss.com",
      },
      {
        name: "Framer Motion",
        detail: "Animation Library",
        url: "https://motion.dev",
      },
      {
        name: "Zustand",
        detail: "State Management",
        url: "https://zustand-demo.pmnd.rs",
      },
      {
        name: "SwiftUI",
        detail: "Native iOS UI",
        url: "https://developer.apple.com/xcode/swiftui/",
      },
      {
        name: "React Query",
        detail: "Server State",
        url: "https://tanstack.com/query",
      },
      {
        name: "Vite",
        detail: "Build Tool",
        url: "https://vitejs.dev",
      },
    ],
  },
  {
    key: "backend" as const,
    items: [
      {
        name: "NestJS",
        detail: "Backend Framework",
        url: "https://nestjs.com",
        featured: true,
      },
      {
        name: "Node.js",
        detail: "JS Runtime",
        url: "https://nodejs.org",
        featured: true,
      },
      {
        name: "PostgreSQL",
        detail: "Relational DB",
        url: "https://www.postgresql.org",
        featured: true,
      },
      { name: "Prisma", detail: "Type-safe ORM", url: "https://www.prisma.io" },
      {
        name: "Drizzle",
        detail: "SQL-like ORM",
        url: "https://orm.drizzle.team",
      },
      { name: "Redis", detail: "In-Memory Cache", url: "https://redis.io" },
      {
        name: "Grammy",
        detail: "Telegram Bot Framework",
        url: "https://grammy.dev",
        featured: true,
      },
      {
        name: "YooKassa",
        detail: "Payment Processing",
        url: "https://yookassa.ru",
      },
      {
        name: "Zod",
        detail: "Schema Validation",
        url: "https://zod.dev",
      },
      {
        name: "WebSocket",
        detail: "Real-time",
        url: "https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API",
      },
      {
        name: "Rust",
        detail: "Systems Language",
        url: "https://www.rust-lang.org",
        featured: true,
      },
      {
        name: "Axum",
        detail: "Rust Web Framework",
        url: "https://github.com/tokio-rs/axum",
      },
      {
        name: "Bun",
        detail: "JS Runtime & Bundler",
        url: "https://bun.sh",
      },
    ],
  },
  {
    key: "tools" as const,
    items: [
      {
        name: "Tauri",
        detail: "Desktop Apps",
        url: "https://tauri.app",
        featured: true,
      },
      { name: "Git", detail: "Version Control", url: "https://git-scm.com" },
      {
        name: "Biome",
        detail: "Linter & Formatter",
        url: "https://biomejs.dev",
        featured: true,
      },
      {
        name: "Vitest",
        detail: "Unit Testing",
        url: "https://vitest.dev",
      },
      {
        name: "Playwright",
        detail: "E2E Testing",
        url: "https://playwright.dev",
      },
      {
        name: "Sentry",
        detail: "Error Monitoring",
        url: "https://sentry.io/welcome",
      },
      {
        name: "Swagger",
        detail: "API Docs",
        url: "https://swagger.io",
      },
      {
        name: "Postman",
        detail: "API Testing",
        url: "https://www.postman.com",
      },
      {
        name: "Linear",
        detail: "Project Tracking",
        url: "https://linear.app",
      },
      {
        name: "Notion",
        detail: "Documentation",
        url: "https://www.notion.so",
      },
    ],
  },
  {
    key: "infra" as const,
    items: [
      {
        name: "Docker",
        detail: "Containerization",
        url: "https://www.docker.com",
        featured: true,
      },
      {
        name: "Railway",
        detail: "Cloud Deployment",
        url: "https://railway.app",
        featured: true,
      },
      {
        name: "Vercel",
        detail: "Edge Deployment",
        url: "https://vercel.com",
        featured: true,
      },
      {
        name: "GitHub Actions",
        detail: "CI/CD Pipelines",
        url: "https://github.com/features/actions",
      },
      {
        name: "Nginx",
        detail: "Web Server / Proxy",
        url: "https://nginx.org",
      },
      {
        name: "Cloudflare",
        detail: "CDN & DNS",
        url: "https://www.cloudflare.com",
      },
      {
        name: "S3",
        detail: "Object Storage",
        url: "https://aws.amazon.com/s3/",
      },
      {
        name: "Ubuntu",
        detail: "Server OS",
        url: "https://ubuntu.com",
      },
      {
        name: "Turborepo",
        detail: "Monorepo Build",
        url: "https://turbo.build",
      },
      {
        name: "pnpm",
        detail: "Package Manager",
        url: "https://pnpm.io",
      },
    ],
  },
];
