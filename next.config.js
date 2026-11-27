/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // Keep the Puppeteer / Sparticuz Chromium packages out of the
    // server bundle: they load a native Chromium binary at runtime.
    serverComponentsExternalPackages: ["@sparticuz/chromium", "puppeteer-core"],
    // Include the Sparticuz Chromium binary in the serverless function
    // output, or /api/pdf/* 500s with a missing-bin error on Vercel.
    outputFileTracingIncludes: {
      "/api/pdf/*": ["./node_modules/@sparticuz/chromium/bin/**"],
    },
  },
};

module.exports = nextConfig;
