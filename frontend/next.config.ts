import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    '192.168.1.100',
    '192.168.1.100:3000',
    'http://192.168.1.100',
    'http://192.168.1.100:3000'
  ],
  // SECURITY (VULN-07): Restrict to known trusted image domains only.
  // Wildcard (**) patterns allow SSRF via the Next.js image optimizer.
  images: {
    remotePatterns: [
      // Cloudinary — used for uploaded portfolio images
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      // Common external image sources (add more as needed)
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
    ],
  },
  // SECURITY (VULN-08): Removed wildcard CORS header.
  // The backend handles its own CORS; no Next.js API routes need cross-origin access here.
};

export default nextConfig;

