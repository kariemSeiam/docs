/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['i.ytimg.com', 'yt3.ggpht.com'],
    unoptimized: true, // Required for static export
  },
  output: 'export', // Enable static exports
  basePath: process.env.NODE_ENV === 'production' ? '/workspace' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/workspace' : '',
}

module.exports = nextConfig