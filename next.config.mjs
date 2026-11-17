import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** Set STATIC_EXPORT=true to build a fully static site (used for GitHub Pages). */
const isStaticExport = process.env.STATIC_EXPORT === 'true';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: isStaticExport ? 'export' : undefined,
  // Hosting under a sub-path, e.g. /hotel-listings on GitHub Pages.
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  trailingSlash: isStaticExport,
};

export default withNextIntl(nextConfig);
