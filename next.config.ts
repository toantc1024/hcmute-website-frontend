import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "9000",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "minio.hcmutertic.com",
        pathname: "/**",
      },
            {
        protocol: 'http',
        hostname: 'minio',
        port: '9000',
        pathname: '/hcmute-website-bucket/**',
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Allow localhost images in development
    ...(process.env.NODE_ENV === "development" && {
      unoptimized: false,
    }),
  },
};

export default nextConfig;
