import { MetadataRoute } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kepio.app';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/uz$', '/en$', '/uz', '/en'],
        disallow: [
          '/*/library',
          '/*/library/*',
          '/*/daily',
          '/*/archive',
          '/*/settings',
          '/*/sign-in',
          '/dev/*',
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
