/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        //domains: ['localhost'],
        protocol: 'https',
        //hostname: 'localhost',
        hostname: 'qwq1hpjx-8000.brs.devtunnels.ms',
        pathname: '**',
      },
    ],
  },
};

export default nextConfig;