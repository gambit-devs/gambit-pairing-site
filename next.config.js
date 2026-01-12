/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // Cloudflare Pages/Workers handle clean URLs well without trailing slashes.
  trailingSlash: false,
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
