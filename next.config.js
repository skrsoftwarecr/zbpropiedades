/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración mínima, se prefiere next.config.ts en este proyecto
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'picsum.photos' }
    ],
  },
};

module.exports = nextConfig;