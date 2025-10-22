/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
  allowedDevOrigins: [
    'localhost',
    '127.0.0.1',
    ...(process.env.REPLIT_DOMAINS ? process.env.REPLIT_DOMAINS.split(',').map(d => d.trim()) : []),
  ].filter(Boolean),
}

module.exports = nextConfig
