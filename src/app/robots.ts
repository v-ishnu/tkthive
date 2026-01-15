import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/profile/', '/auth/', '/admin/'],
        },
        sitemap: 'https://tkthive.com/sitemap.xml', // Replace with actual domain
    };
}
