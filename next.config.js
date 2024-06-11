/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
   serverActions: true,
    serverComponentsExternalPackages: ['mongoose']
  },
  images: {
    domains: ['m.media-amazon.com', 'n2.sdlcdn.com', 'n4.sdlcdn.com', 'n1.sdlcdn.com','n3.sdlcdn.com','n5.sdlcdn.com','n6.sdlcdn.com','media-ik.croma.com','cdn.shopclues.com','www.jiomart.com'],
    //domains: ['m.media-amazon.com']
   
  }
}
module.exports = nextConfig

