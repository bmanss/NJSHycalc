/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
          {
            source: '/mojang/uuid/:slug*',
            destination: 'https://api.mojang.com/users/profiles/minecraft/:splat',
            permanent: true,
          },
        ]
      },
}

module.exports = nextConfig
