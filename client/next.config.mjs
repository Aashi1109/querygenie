/** @type {import('next').NextConfig} */
const nextConfig = {
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
