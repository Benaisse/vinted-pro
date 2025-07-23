/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration pour éviter les erreurs de compilation
  experimental: {
    // appDir: true, // supprimé car obsolète
  },
  // Gestion des erreurs de compilation
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  // Optimisations pour le développement
  swcMinify: true,
  // Gestion des images
  images: {
    domains: [],
  },
}

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  ...nextConfig,
}); 