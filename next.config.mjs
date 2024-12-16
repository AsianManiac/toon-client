/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "4020",
        pathname: "public/**",
      },
    ],
    domains: ["localhost"],
  },
};

export default nextConfig;
