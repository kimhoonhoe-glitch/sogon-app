/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
  allowedDevOrigins: [
    'localhost:5000',
    '127.0.0.1:5000',
    ...(process.env.REPLIT_DOMAINS ? process.env.REPLIT_DOMAINS.split(',') : []),
    '*.replit.dev',
    '*.worf.replit.dev',
  ].filter(Boolean),
}

module.exports = nextConfig
