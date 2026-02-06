/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.e-vuka.com",
        pathname: "/media/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8080",
        pathname: "/media/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        pathname: "/media/**",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "evuka-cdn.b-cdn.net",
        pathname: "/**",
      },
    ],
  },

  webpack: (config: any) => { // Added : any here
  config.resolve.alias.canvas = false;
  config.resolve.alias.encoding = false;
  return config;
},
};

// Use export default instead of module.exports if you are using .mjs
export default nextConfig;