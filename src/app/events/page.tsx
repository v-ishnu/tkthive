"use client";
import { EventsSection } from "@/components/event/EventSection";
import { MOCK_EVENTS } from '../../constants';
import { useState } from 'react';
import { EventData } from '../../types';

export default function EventsPage() {
    const [events, setEvents] = useState<EventData[]>(MOCK_EVENTS);
    const [loading, setLoading] = useState(false);


    const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [locationCity, setLocationCity] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const handleEventClick = (event: EventData) => {
        setSelectedEvent(event);
        window.scrollTo({ top: 0, behavior: 'instant' });
    };
    const onEventClick = (event: EventData) => { };
    const onCategoryChange = (category: string) => { };
    return (
        <div>
            <div className="container mx-auto px-4 pt-12 pb-12 min-h-screen">
                <EventsSection
                    events={events}
                    loading={loading}
                    locationCity={locationCity || ''}
                    selectedCategory={categoryFilter}
                    onCategoryChange={setCategoryFilter}
                    onEventClick={handleEventClick}
                />
            </div>
        </div>
    );
}