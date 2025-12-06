"use client";
import { EventsSection } from "@/components/event/EventSection";
import { MOCK_EVENTS } from '../../constants';
import { useState } from 'react';
import { EventData } from '../../types';

export default function EventsPage() {
   const [events, setEvents] = useState<EventData[]>(MOCK_EVENTS);
   const [loading, setLoading] = useState(false);
   const [locationCity, setLocationCity] = useState('');
   const [selectedCategory, setSelectedCategory] = useState('');
   const onEventClick = (event: EventData) => {};
   const onCategoryChange = (category: string) => {};
    return (
        <div>
              <div className="container mx-auto px-4 pt-32 pb-12 min-h-screen">
           <EventsSection events={events} loading={loading} onEventClick={onEventClick} locationCity={locationCity} selectedCategory={selectedCategory} onCategoryChange={onCategoryChange}/>
       </div>
        </div>
    );
}