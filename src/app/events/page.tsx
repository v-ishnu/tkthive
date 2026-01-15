"use client";
import { EventsSection } from "@/components/event/EventSection";
// import { MOCK_EVENTS } from '../../constants'; // Removed Mock
import { useState, useEffect } from 'react';
import { EventData } from '../../types';
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchAllEvents, fetchLocations } from "@/store/slices/eventSlice";
import { RootState } from "@/store/store";

import { useSearchParams, useRouter, usePathname } from 'next/navigation';

import { Suspense } from 'react';

function EventsContent() {
    const dispatch = useAppDispatch();
    const { events, loading, locations } = useAppSelector((state: RootState) => state.event);
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const categoryParam = searchParams.get('category');

    useEffect(() => {
        dispatch(fetchAllEvents());
        dispatch(fetchLocations());
    }, [dispatch]);

    const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
    // Initialize category from URL or default to 'All'
    const [categoryFilter, setCategoryFilter] = useState(categoryParam || 'All');
    const [locationCity, setLocationCity] = useState('');

    useEffect(() => {
        if (categoryParam) {
            setCategoryFilter(categoryParam);
        } else {
            setCategoryFilter('All');
        }
    }, [categoryParam]);

    const handleCategoryChange = (category: string) => {
        setCategoryFilter(category);
        const params = new URLSearchParams(searchParams.toString());
        if (category && category !== 'All') {
            params.set('category', category);
        } else {
            params.delete('category');
        }
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const handleEventClick = (event: EventData) => {
        setSelectedEvent(event);
        window.scrollTo({ top: 0, behavior: 'instant' });
    };

    return (
        <div className="container mx-auto px-4 pt-12 pb-12 min-h-screen">
            <EventsSection
                events={events}
                loading={loading}
                availableLocations={locations}
                locationCity={locationCity || ''}
                selectedCategory={categoryFilter}
                onCategoryChange={handleCategoryChange}
                onEventClick={handleEventClick}
            />
        </div>
    );
}

export default function EventsPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Loading...</div>}>
            <EventsContent />
        </Suspense>
    );
}
