/** @type {import('next').NextConfig} */

// When building for GitHub Pages we emit a fully static export served from a
// project subpath (https://<user>.github.io/<repo>/). This is gated behind an
// env flag so local `dev`/`build` and any Node host stay unaffected.
const isPages = process.env.PAGES_BUILD === "1";
const repoBasePath = process.env.PAGES_BASE_PATH || "";

const nextConfig = {
  reactStrictMode: true,
  // Keep production builds green on first run. Type-safety is still enforced
  // via `npm run typecheck`; linting is run separately in CI via `npm run lint`.
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  ...(isPages
    ? {
        output: "export",
        basePath: repoBasePath,
        assetPrefix: repoBasePath ? `${repoBasePath}/` : undefined,
        images: { unoptimized: true },
        trailingSlash: true,
      }
    : {}),
};

export default nextConfig;
