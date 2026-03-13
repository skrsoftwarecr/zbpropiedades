import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  const siteUrl = 'https://www.bimmercr.com'; // Use production URL

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/cart', '/checkout', '/admin'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
