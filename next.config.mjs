/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@refinedev/antd"],
  output: "standalone",
  compress: false,
};

export default nextConfig;
