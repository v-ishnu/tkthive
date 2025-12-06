import React from 'react';
import { EventCard } from '../EventCard';
import { EventData } from '../../types';

interface EventGridProps {
  events: EventData[];
  loading: boolean;
  onEventClick: (event: EventData) => void;
}

export const EventGrid: React.FC<EventGridProps> = ({ events, loading, onEventClick }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="bg-card rounded-xl h-[200px] animate-pulse border border-white/5">
            <div className="h-32 bg-white/5 rounded-t-xl" />
            <div className="p-3 space-y-2">
              <div className="flex gap-2">
                  <div className="w-8 h-8 bg-white/5 rounded" />
                  <div className="flex-1 space-y-1">
                       <div className="h-3 w-2/3 bg-white/5 rounded" />
                       <div className="h-2 w-1/2 bg-white/5 rounded" />
                  </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-20 bg-card/50 rounded-3xl border border-dashed border-white/10">
        <h3 className="text-2xl text-gray-300 mb-2">No events found</h3>
        <p className="text-gray-500">Try adjusting your search filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
      {events.map((event) => (
        <EventCard key={event.id} event={event} onClick={onEventClick} />
      ))}
    </div>
  );
};