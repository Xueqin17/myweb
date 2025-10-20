/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverExternalPackages: ['sqlite3', 'sequelize'],
  },
  webpack: (config) => {
    config.externals.push({
      sqlite3: 'commonjs sqlite3',
    });
    return config;
  },
};

module.exports = nextConfig;