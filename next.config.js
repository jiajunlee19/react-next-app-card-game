/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "avatars.steamstatic.com",
                pathname: "/**",
            }
        ]
    }
}

module.exports = nextConfig
