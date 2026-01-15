
import React, { useState, useMemo } from 'react';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { EventData } from '../../types';

interface FeaturedEventsProps {
    events: EventData[];

}

export const FeaturedEvents: React.FC<FeaturedEventsProps> = ({ events }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    // Filter for featured events, fallback to first 4 if none found
    const featuredEvents = useMemo(() => {
        const featured = events.filter(e => e.featured);
        if (featured.length >= 3) return featured.slice(0, 4);
        return events.slice(0, 4); // Fallback
    }, [events]);

    const getStatus = (event: EventData) => {
        if (event.isLive) return 'LIVE';
        if (event.venue.name.toLowerCase().includes('online')) return 'ONLINE';
        if (event.featured) return 'FEATURED';
        return 'UPCOMING';
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'LIVE': return 'bg-red-600 animate-pulse';
            case 'ONLINE': return 'bg-blue-600';
            case 'FEATURED': return 'bg-primary text-black';
            default: return 'bg-white/10 backdrop-blur-md text-white border border-white/10';
        }
    };

    if (featuredEvents.length === 0) {
        return (
            <div className="container mx-auto w-full px-4 mb-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3 text-white">
                            Featured Collections <span className="text-2xl animate-pulse">✨</span>
                        </h2>
                        <p className="text-text-secondary mt-2 text-sm md:text-base">Hand-picked events you can't miss</p>
                    </div>
                </div>
                <div className="w-full h-64 flex items-center justify-center border border-white/5 rounded-3xl bg-white/5">
                    <p className="text-gray-400 text-lg">No upcoming event found</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto w-full px-4">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3 text-white">
                        Featured Collections <span className="text-2xl animate-pulse">✨</span>
                    </h2>
                    <p className="text-text-secondary mt-2 text-sm md:text-base">Hand-picked events you can't miss</p>
                </div>


            </div>

            {/* Expandable Cards Container */}
            <div className={`flex flex-col md:flex-row gap-4 h-auto md:min-h-0 md:h-[450px] ${featuredEvents.length === 1 ? 'min-h-[500px]' : 'min-h-[800px]'}`}>
                {featuredEvents.map((event, index) => {
                    const status = getStatus(event);
                    return (
                        <div
                            key={event.id}
                            onMouseEnter={() => setActiveIndex(index)}
                            onClick={() => {
                                setActiveIndex(index);

                            }}
                            className={`
                relative rounded-3xl overflow-hidden cursor-pointer transition-[flex] duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)]
                ${activeIndex === index ? 'flex-[2] md:flex-[3]' : 'flex-[1] md:flex-[1] md:flex-[0.5]'}
                group border border-white/5 shadow-2xl min-h-[150px] md:min-h-0
                `}
                        >
                            {/* Background Image */}
                            <div className="absolute inset-0">
                                <img
                                    src={event.imageUrl}
                                    alt={event.title}
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                />
                                <div className={`absolute inset-0 bg-gradient-to-t from-dark via-dark/20 to-transparent transition-opacity duration-500 ${activeIndex === index ? 'opacity-90' : 'opacity-60'}`} />
                                <div className={`absolute inset-0 bg-black/40 transition-opacity duration-500 ${activeIndex === index ? 'opacity-0' : 'opacity-100'}`} />
                            </div>

                            {/* Content */}
                            <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-between">
                                <div className="flex justify-between items-start">
                                    <span className={`
                            px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider shadow-lg
                            ${getStatusColor(status)}
                        `}>
                                        {status}
                                    </span>

                                    <Link href={`/events/${event.slug}`} className={`
                            w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary flex items-center justify-center
                            transition-all duration-500 transform
                            ${activeIndex === index ? 'scale-100 opacity-100 rotate-0' : 'scale-50 opacity-0 -rotate-45'}
                        `}>
                                        <ArrowUpRight className="text-black" size={20} />
                                    </Link>
                                </div>

                                <div className={`
                        transition-all duration-500 transform
                        ${activeIndex === index ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-70'}
                    `}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="w-8 h-0.5 bg-primary rounded-full" />
                                        <p className="text-primary font-bold text-xs md:text-sm tracking-widest uppercase">{event.category} • {event.venue.name.toLowerCase().includes('online') ? 'Virtual' : 'Live'}</p>
                                    </div>

                                    <h3 className={`
                            font-bold text-white mb-3 leading-none transition-all duration-500
                            ${activeIndex === index ? 'text-2xl md:text-5xl' : 'text-lg md:text-2xl line-clamp-2'}
                        `}>
                                        {event.title}
                                    </h3>

                                    <div className={`
                            overflow-hidden transition-all duration-500
                            ${activeIndex === index ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}
                        `}>
                                        <p className="text-text-secondary text-sm md:text-base flex items-center gap-2">
                                            <CalendarIcon />
                                            {event.date}
                                        </p>
                                        <Link href={`/events/${event.slug}`} className="mt-4 text-sm text-white border-b border-primary hover:text-primary transition-colors pb-0.5">
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const CalendarIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg>
);
