import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  const siteUrl = 'https://example.com'; // Placeholder URL

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/cart', '/checkout'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
