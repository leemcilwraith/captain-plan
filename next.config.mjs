/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Fully client-side app (no API routes, middleware, or server actions),
  // so ship it as a static export - no Node server needed at runtime.
  output: "export",
};

export default nextConfig;
