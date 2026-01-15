
import React, { useMemo } from 'react';
import { EventData } from '../../types';
import { EventCard } from '../EventCard';
import { ArrowRight, Calendar } from 'lucide-react';
import Link from 'next/link';

interface HomeUpcomingSectionProps {
  events: EventData[];
  onEventClick: (event: EventData) => void;
  onViewAll: () => void;
}

export const HomeUpcomingSection: React.FC<HomeUpcomingSectionProps> = ({ events }) => {
  // Filter for upcoming events and limit to 8
  const upcomingEvents = useMemo(() => {
    return events
      .filter(e => {
        // Simple date check, assuming MOCK format works or using fallback
        // In a real app, use a robust date library
        if (e.isLive) return false; // Exclude live events from "Upcoming" list if desired, or keep them
        return true;
      })
      .slice(0, 8);
  }, [events]);

  return (
    <div className="py-12 container mx-auto px-4">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            Upcoming Events <Calendar className="text-primary" size={28} />
          </h2>
          <p className="text-text-secondary">Book your tickets before they sell out</p>
        </div>
        <Link href="/events"

          className="hidden md:flex items-center gap-2 text-primary hover:text-white transition-colors font-bold uppercase tracking-wide text-sm"
        >
          View All Events <ArrowRight size={18} />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {upcomingEvents.length > 0 ? (
          upcomingEvents.map(event => (
            <EventCard key={event.id} event={event} />
          ))
        ) : (
          <div className="col-span-full h-64 flex items-center justify-center border border-white/5 rounded-3xl bg-white/5">
            <p className="text-gray-400 text-lg">No upcoming event found</p>
          </div>
        )}
      </div>

      <div className="mt-12 flex justify-center md:hidden">
        <Link href="/events"
           
          className="px-8 py-3 bg-white/5 border border-white/10 hover:bg-primary hover:text-black rounded-full text-white font-bold transition-all w-full sm:w-auto"
        >
          Explore All Events
        </Link>
      </div>
    </div>
  );
};
