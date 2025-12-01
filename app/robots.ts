import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://cooperstaxation.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/admin/',
        '/user/dashboard/',
        '/_next/',
        '/uploads/',
        '/logs/',
        '/scripts/'
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}