/* BASE_PATH: em GitHub Actions use /nome-do-repo. Em dev, deixe vazio. */
const raw = process.env.BASE_PATH?.trim() ?? "";
const basePath = raw === "/" ? "" : raw.replace(/\/$/, "");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Site 100% estático: HTML/JS/CSS em `out/` — sem servidor Node em produção.
  output: "export",
  // GitHub Pages (site de projeto) publica em /<nome-do-repo>/; trailingSlash evita 404 em rotas.
  trailingSlash: true,
  ...(basePath ? { basePath } : {}),
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
