/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  reactStrictMode: false //set this to false invoke useEffect twice in developermode
};
export default nextConfig;
