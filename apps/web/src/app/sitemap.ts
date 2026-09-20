import { MetadataRoute } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kepio.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: `${siteUrl}/uz`,
      lastModified,
      changeFrequency: 'daily',
      priority: 1.0,
      alternates: {
        languages: {
          uz: `${siteUrl}/uz`,
          en: `${siteUrl}/en`,
          'x-default': `${siteUrl}/en`,
        },
      },
    },
    {
      url: `${siteUrl}/en`,
      lastModified,
      changeFrequency: 'daily',
      priority: 1.0,
      alternates: {
        languages: {
          uz: `${siteUrl}/uz`,
          en: `${siteUrl}/en`,
          'x-default': `${siteUrl}/en`,
        },
      },
    },
  ];
}
