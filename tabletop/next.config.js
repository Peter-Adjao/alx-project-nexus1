
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'images.unsplash.com',
      'fakestoreapi.com',
      'via.placeholder.com'
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};



// ✅ Correct way to import CommonJS module in ESM
const nextPWA = await import('next-pwa');
const withPWA = nextPWA.default;

export default withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
})(nextConfig);