import type { NextConfig } from "next";
import { site } from "./src/lib/site";

const nextConfig: NextConfig = {
  output: "standalone",
  reactCompiler: true,

  /*
   * Канонический адрес один: без www. Ссылки с www должны вести на сайт,
   * а не в тупик, и при этом не превращаться во второй адрес с тем же
   * содержимым, который поисковики считают отдельной страницей.
   */
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: `www.${site.domain}` }],
        destination: `${site.url}/:path*`,
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
