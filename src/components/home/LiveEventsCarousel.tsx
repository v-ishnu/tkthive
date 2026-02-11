import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, Calendar, Clock, ArrowRight } from 'lucide-react';
import { EventData } from '../../types';

interface LiveEventsCarouselProps {
    events: EventData[];
}

export const LiveEventsCarousel: React.FC<LiveEventsCarouselProps> = ({ events }) => {
    const [liveEvents, setLiveEvents] = useState<EventData[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const now = new Date();
        const filtered = events.filter(event => {
            if (!event.startDate || !event.endDate) return false;
            const start = new Date(event.startDate);
            const end = new Date(event.endDate);
            return start <= now && end >= now;
        });
        setLiveEvents(filtered);
    }, [events]);

    useEffect(() => {
        if (liveEvents.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % liveEvents.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [liveEvents]);

    if (liveEvents.length === 0) return null;

    const currentEvent = liveEvents[currentIndex];

    // Formatting helpers
    const eventDate = currentEvent.startDate ? new Date(currentEvent.startDate) : new Date();
    const formattedDate = eventDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    const formattedTime = eventDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    return (
        <div className="w-full bg-zinc-950 border-y border-white/5 relative overflow-hidden">
            {/* Background Gradient Effect */}
            <div className="absolute inset-0 bg-linear-to-r from-red-900/10 via-transparent to-red-900/10 pointer-events-none" />

            <div className="container mx-auto px-4 py-8 relative z-10">
                <div className="flex flex-col md:flex-row items-center gap-6 justify-between">

                    {/* Header / Badge */}
                    <div className="flex items-center gap-4 shrink-0">
                        <div className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
                        </div>
                        <h2 className="text-xl md:text-2xl font-black uppercase tracking-wider text-white">
                            Happening <span className="text-red-500">Now</span>
                        </h2>
                    </div>

                    {/* Event Content - Animated Transition */}
                    <div className="flex-1 w-full max-w-4xl relative min-h-[120px] md:min-h-auto flex items-center">
                        {liveEvents.map((event, idx) => (
                            <div
                                key={event.id}
                                className={`transition-all duration-700 absolute w-full flex flex-col md:flex-row items-center justify-between gap-6 p-6 rounded-2xl border border-white/10 bg-zinc-900/50 backdrop-blur-sm
                                ${idx === currentIndex ? 'opacity-100 translate-y-0 scale-100 relative' : 'opacity-0 translate-y-8 scale-95 absolute inset-0 pointer-events-none'}`}
                            >
                                {/* Info */}
                                <div className="flex-1 text-center md:text-left">
                                    <h3 className="text-lg md:text-2xl font-bold text-white mb-2 line-clamp-1">
                                        {event.title}
                                    </h3>
                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-zinc-400">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar size={14} className="text-amber-500" />
                                            <span>{formattedDate}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Clock size={14} className="text-amber-500" />
                                            <span>{formattedTime}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <MapPin size={14} className="text-amber-500" />
                                            <span>{event.venue?.name}, {event.venue?.city}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Action */}
                                <Link
                                    href={`/events/${event.slug}`}
                                    className="shrink-0 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-full transition-colors flex items-center gap-2"
                                >
                                    Join Live
                                    <ArrowRight size={16} />
                                </Link>
                            </div>
                        ))}
                    </div>

                    {/* Controls (Indicators) */}
                    <div className="flex gap-2 shrink-0">
                        {liveEvents.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? 'bg-red-500 w-6' : 'bg-zinc-800 hover:bg-zinc-700'}`}
                                aria-label={`Go to slide ${idx + 1}`}
                            />
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
};
