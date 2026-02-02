
import React, { useMemo } from 'react';
import { EventData } from '../../types';
import { EventCard } from '../EventCard';
import { ArrowRight, Calendar } from 'lucide-react';
import Link from 'next/link';

interface HomeUpcomingSectionProps {
  events: EventData[];
  onEventClick: (event: EventData) => void;
  onViewAll: () => void;
  isLoading?: boolean;
}

export const HomeUpcomingSection: React.FC<HomeUpcomingSectionProps> = ({ events, isLoading }) => {
  // Filter for upcoming events and limit to 8
  const upcomingEvents = useMemo(() => {
    return events
      .filter(e => {
        if (!e.startDate) return false;
        const now = new Date();
        const start = new Date(e.startDate);
        return start > now;
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
        {isLoading ? (
          Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="flex flex-col h-[380px] bg-white/5 rounded-2xl border border-white/5 overflow-hidden animate-pulse">
              <div className="h-48 bg-white/10 w-full" />
              <div className="p-4 flex-1 space-y-3">
                <div className="flex justify-between">
                  <div className="h-4 w-20 bg-white/10 rounded" />
                  <div className="h-4 w-16 bg-white/10 rounded" />
                </div>
                <div className="h-6 w-3/4 bg-white/10 rounded" />
                <div className="h-4 w-1/2 bg-white/10 rounded" />
                <div className="mt-auto h-10 w-full bg-white/10 rounded-lg" />
              </div>
            </div>
          ))
        ) : upcomingEvents.length > 0 ? (
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
