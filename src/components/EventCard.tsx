
import React from 'react';
import { MapPin, Bookmark, Lock, Users, Globe } from 'lucide-react';
import { EventData } from '../types';

interface EventCardProps {
  event: EventData;
  onClick?: (event: EventData) => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onClick }) => {
  // Parse date for distinct display
  let month = 'DEC';
  let day = '31';

  try {
    const dateParts = event.date.split(',');
    if (dateParts.length > 1) {
        const trimmed = dateParts[1].trim(); // "Nov 24"
        const parts = trimmed.split(' '); // ["Nov", "24"]
        if (parts.length >= 2) {
            month = parts[0].substring(0, 3).toUpperCase();
            day = parts[1];
        }
    }
  } catch (e) {
      // Fallback
  }

  // Generate deterministic random avatars based on event ID
  const seed = event.id.length; 
  const attendeeCount = 10 + (seed * 5);

  // Check if event is online
  const isOnline = event.venue.toLowerCase().includes('online') || event.venue.toLowerCase().includes('virtual');

  return (
    <div 
      className="group bg-card hover:bg-card-hover border border-white/5 hover:border-white/10 rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-2xl flex flex-col h-full relative"
      onClick={() => onClick?.(event)}
    >
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={event.imageUrl} 
          alt={event.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />

        {/* Floating Date Badge (Top Left) */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md rounded-2xl p-2.5 min-w-[60px] flex flex-col items-center justify-center shadow-lg text-black">
             <span className="text-[10px] font-bold tracking-widest uppercase text-red-600 mb-0.5">{month}</span>
             <span className="text-xl font-black leading-none">{day}</span>
        </div>

        {/* Bookmark Action (Top Right) */}
        <div className="absolute top-4 right-4">
             <button className="bg-black/30 backdrop-blur-md hover:bg-primary hover:text-black text-white p-2.5 rounded-full transition-colors border border-white/10">
                 <Bookmark size={18} />
             </button>
        </div>

        {/* Status Tags (Bottom Left of Image) */}
        <div className="absolute bottom-4 left-4 flex gap-2">
            {event.isLive && (
                <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-lg animate-pulse shadow-lg flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-white rounded-full" /> LIVE
                </span>
            )}
            {event.accessType === 'private' && (
                <span className="bg-black/80 backdrop-blur text-white text-[10px] font-bold px-2 py-1 rounded-lg border border-white/10 flex items-center gap-1">
                    <Lock size={10} className="text-primary" /> Private
                </span>
            )}
            {isOnline && (
                 <span className="bg-blue-600/90 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-lg flex items-center gap-1">
                    <Globe size={10} /> ONLINE
                </span>
            )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-white mb-1 leading-tight group-hover:text-primary transition-colors line-clamp-2">
            {event.title}
        </h3>
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-4">
            {event.category || 'General Event'}
        </p>

     

        {/* Footer Info */}
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
             <div className="flex items-center gap-1.5 text-gray-400 max-w-[60%]">
                <MapPin size={14} className="shrink-0 text-gray-500" />
                <span className="text-xs font-medium truncate">{event.venue}</span>
             </div>
             
             <div className="text-sm font-bold text-white bg-white/5 px-2.5 py-1 rounded-lg border border-white/5 group-hover:border-primary/30 transition-colors">
                 {event.price}
             </div>
        </div>
      </div>
    </div>
  );
};
