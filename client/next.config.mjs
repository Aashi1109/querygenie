/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    experimental: {
        serverActions: {
            bodySizeLimit: "10mb"
        }
    },
    eslint: {
        ignoreDuringBuilds: false
    }
};

export default nextConfig;
