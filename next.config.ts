import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  reactCompiler: true,
  async rewrites() {
    // Красивый адрес для резюме; сам файл отдаёт роут, читающий его с тома.
    return [{ source: "/resume.pdf", destination: "/api/resume" }];
  },
};

export default nextConfig;
