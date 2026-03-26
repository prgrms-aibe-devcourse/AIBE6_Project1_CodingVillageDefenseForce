import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactCompiler: true,
  experimental: {
    typedRoutes: false,
  },
}

export default nextConfig
