import { Metadata } from 'next';
import EventDetailsClient from './EventDetailsClient';

type Props = {
    params: Promise<{ id: string }>
}

async function getEvent(id: string) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/event/get/${id}`, {
            next: { revalidate: 60 } // Revalidate every minute
        });

        if (!res.ok) return null;

        const data = await res.json();
        if (data.message === "EVENT_FETCHED") {
            return data.event;
        }
        return null;
    } catch (error) {
        console.error("Error fetching event for metadata:", error);
        return null;
    }
}

export async function generateMetadata(props: Props): Promise<Metadata> {
    const params = await props.params;
    const event = await getEvent(params.id);

    if (!event) {
        return {
            title: 'Event Not Found | tkthive',
            description: 'The requested event could not be found.',
        }
    }

    const title = `${event.title} `;
    const description = event.description || `Join us for ${event.title}. Book your tickets now on tkthive.`;
    const imageUrl = event.imageUrl || '/og-image.jpg';

    return {
        title: title,
        description: description,
        openGraph: {
            title: title,
            description: description,
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                }
            ],
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: title,
            description: description,
            images: [imageUrl],
        }
    }
}

export default function Page() {
    return <EventDetailsClient />
}
