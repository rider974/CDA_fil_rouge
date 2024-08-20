import path from 'path';
import { fileURLToPath } from 'url';

// Convertir `import.meta.url` en __filename et __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nextConfig = {
  webpack: (config) => {
    config.resolve.alias['@back-entity'] = path.resolve(__dirname, '../back/src/entity');
    config.resolve.alias['@back-utils'] = path.resolve(__dirname, '../back/src/utils');
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'blog.lesjeudis.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'blog.stackademic.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'medium.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.etic-insa.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;