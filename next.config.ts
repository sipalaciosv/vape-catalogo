/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["res.cloudinary.com"], // Si usas imágenes desde Cloudinary
  },
};

module.exports = nextConfig;
