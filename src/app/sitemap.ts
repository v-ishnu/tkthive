import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Base URL
    const baseUrl = 'https://tkthive.com'; // Replace with actual domain
    const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/api`;

    // Static routes
    const routes = [
        '',
        '/events',
        '/why-us',
        '/terms',
        '/auth',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // Fetch dynamic event routes
    let eventRoutes: MetadataRoute.Sitemap = [];
    try {
        const response = await fetch(`${backendUrl}/user/event/get`, {
            // Revalidate every hour
            next: { revalidate: 3600 }
        });

        if (response.ok) {
            const data = await response.json();
            if (data.message === "EVENTS_FETCHED" && Array.isArray(data.events)) {
                eventRoutes = data.events.map((event: any) => ({
                    url: `${baseUrl}/events/${event.slug || event.id}`,
                    lastModified: new Date(event.updatedAt || new Date()),
                    changeFrequency: 'weekly' as const,
                    priority: 0.9,
                }));
            }
        }
    } catch (error) {
        console.error('Failed to fetch events for sitemap:', error);
    }

    return [...routes, ...eventRoutes];
}
