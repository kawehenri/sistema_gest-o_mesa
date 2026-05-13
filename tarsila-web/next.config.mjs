/** @type {import('next').NextConfig} */
const nextConfig = {
  // Site 100% estático: HTML/JS/CSS em `out/` — sem servidor Node em produção.
  output: "export",
  images: {
    // Otimização de imagens remota exige servidor Next; em export estático usamos origem direta.
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
