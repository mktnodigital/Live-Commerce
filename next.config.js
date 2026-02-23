/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Recomendado para Cloud Run para evitar problemas de permissão em pastas temporárias
  distDir: '.next',
};

export default nextConfig;
