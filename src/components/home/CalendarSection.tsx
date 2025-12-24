import { useState, useMemo } from 'react';
import { EventData } from '../../types';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, MapPin, Clock, ArrowRight } from 'lucide-react';

interface CalendarSectionProps {
    events: EventData[];
}

export function CalendarSection({ events }: CalendarSectionProps) {
    const [currentDate, setCurrentDate] = useState(new Date('2025-11-24'));

    const weekDates = useMemo(() => {
        const dates = [];
        const startOfWeek = new Date(currentDate);
        const day = startOfWeek.getDay();
        const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
        startOfWeek.setDate(diff);

        for (let i = 0; i < 7; i++) {
            const d = new Date(startOfWeek);
            d.setDate(startOfWeek.getDate() + i);
            dates.push(d);
        }
        return dates;
    }, [currentDate]);

    const getEventsForDate = (date: Date) => {
        return events.filter(event => {
            const d = new Date(event.date);
            if (isNaN(d.getTime())) {
                return false;
            }
            return d.getDate() === date.getDate() &&
                d.getMonth() === date.getMonth() &&
                d.getFullYear() === date.getFullYear();
        });
    };

    const changeWeek = (direction: 'next' | 'prev') => {
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
        setCurrentDate(newDate);
    };

    const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

    return (
        <section className="py-20 relative overflow-hidden bg-amber-400 w-full">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-yellow-200/40 blur-[120px] rounded-full" />
                <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] bg-orange-300/30 blur-[100px] rounded-full" />
                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-amber-500/20 to-transparent" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 border border-black/5 text-sm font-semibold text-zinc-800 mb-4">
                            <CalendarIcon size={14} />
                            <span>Event Schedule</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-zinc-900 mb-4 tracking-tight">
                            Upcoming <span className="text-white drop-shadow-sm">Events</span>
                        </h2>
                        <p className="text-zinc-800/80 font-medium max-w-lg text-base md:text-lg">
                            Check out what's happening this week. From tech hackathons to music festivals, find your next adventure.
                        </p>
                    </div>

                    <div className="flex items-center gap-4 bg-white/20 p-2 rounded-2xl border border-white/20 backdrop-blur-md shadow-xl shadow-amber-900/5">
                        <button
                            type="button"
                            onClick={() => changeWeek('prev')}
                            className="p-2 md:p-3 hover:bg-white/40 rounded-xl transition-colors text-zinc-900"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <span className="text-base md:text-lg font-bold text-zinc-900 min-w-[120px] md:min-w-[160px] text-center">
                            {monthName}
                        </span>
                        <button
                            type="button"
                            onClick={() => changeWeek('next')}
                            className="p-2 md:p-3 hover:bg-white/40 rounded-xl transition-colors text-zinc-900"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>

                <div className="flex md:grid md:grid-cols-7 gap-2 md:gap-3 mb-8 md:mb-12 overflow-x-auto pb-4 md:pb-0 scrollbar-hide snap-x">
                    {weekDates.map((date, idx) => {
                        const isSelected = date.getDate() === currentDate.getDate();
                        const dayName = date.toLocaleDateString('default', { weekday: 'short' });
                        const dayNum = date.getDate();
                        const hasEvents = getEventsForDate(date).length > 0;

                        return (
                            <button
                                type="button"
                                key={date.toISOString()}
                                onClick={() => setCurrentDate(date)}
                                className={`
                            relative flex flex-col items-center justify-center py-3 md:py-4 px-3 md:px-0 rounded-2xl transition-all duration-300 min-w-[70px] md:min-w-0 snap-center
                            ${isSelected
                                        ? 'bg-zinc-900 text-yellow-400 shadow-xl shadow-amber-900/20  z-10'
                                        : 'bg-white/40 text-amber-900/60 hover:bg-white/60 border border-white/20'}
                        `}
                            >
                                <span className={`text-[10px] md:text-xs font-bold uppercase tracking-wider mb-1 ${isSelected ? 'opacity-100' : 'opacity-60'}`}>{dayName}</span>
                                <span className="text-xl md:text-2xl font-black">{dayNum}</span>
                                {hasEvents && (
                                    <div className={`absolute bottom-2 w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-yellow-400' : 'bg-zinc-900'}`} />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* List View */}
                <div className="container mx-auto">
                    {(() => {
                        const dayEvents = getEventsForDate(currentDate);

                        if (dayEvents.length === 0) {
                            return (
                                <div className="flex flex-col items-center justify-center py-16 md:py-20 text-amber-900/40 bg-white/10 rounded-3xl border-2 border-dashed border-amber-900/10">
                                    <CalendarIcon size={48} className="mb-4 opacity-40 mix-blend-multiply" />
                                    <p className="text-xl font-bold text-amber-950">No events scheduled</p>
                                    <p className="text-sm font-medium opacity-70">Try checking another date!</p>
                                </div>
                            );
                        }

                        return (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                {dayEvents.map(event => {
                                    const timeString = event.subEvents?.[0]?.time ||
                                        (new Date(event.date).toString() !== 'Invalid Date'
                                            ? new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                            : "All Day");

                                    return (
                                        <div key={event.id} className="group flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 p-4 md:p-6 bg-white rounded-3xl shadow-sm border border-white/40 hover:shadow-xl hover:shadow-amber-900/10 hover:scale-[1.01] transition-all duration-300">

                                            {/* Time Block */}
                                            <div className="flex-shrink-0 w-24 md:text-center">
                                                <div className="inline-flex md:flex md:flex-col items-center gap-2 md:gap-0">
                                                    <span className="block text-2xl font-black text-zinc-900 leading-none">
                                                        {timeString.replace(/\D/g, '') || '09'}
                                                        <span className="text-sm font-bold text-amber-500 ml-0.5 md:ml-0 md:block md:mt-1">
                                                            {timeString.match(/[a-zA-Z]+/)?.[0] || 'AM'}
                                                        </span>
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Image (Small) */}
                                            <div className="hidden md:block w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-zinc-100">
                                                <img
                                                    src={event.imageUrl}
                                                    alt={event.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            </div>

                                            {/* Content */}
                                            <div className="flex-grow min-w-0">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-bold uppercase tracking-wide">
                                                        {event.category}
                                                    </span>
                                                </div>
                                                <h3 className="text-xl font-bold text-zinc-900 mb-1 group-hover:text-amber-600 transition-colors truncate">
                                                    {event.title}
                                                </h3>
                                                <div className="flex items-center gap-4 text-sm text-zinc-500 font-medium">
                                                    <div className="flex items-center gap-1.5">
                                                        <MapPin size={14} className="text-amber-500" />
                                                        <span className="truncate max-w-[200px]">{event.venue}</span>
                                                    </div>
                                                    <div className="hidden md:flex items-center gap-1.5">
                                                        <span className="w-1 h-1 rounded-full bg-zinc-300" />
                                                        <span>By {event.organizer?.name}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action */}
                                            <div className="w-full md:w-auto flex items-center justify-between md:justify-end gap-6 md:pl-6 md:border-l border-zinc-100">
                                                <div className="text-lg font-bold text-zinc-900 whitespace-nowrap">
                                                    {event.price === 'Free' ? 'Free' : event.price}
                                                </div>
                                                <button type="button" className="w-10 h-10 rounded-full bg-zinc-900 text-white flex items-center justify-center group-hover:bg-amber-500 group-hover:rotate-[-45deg] transition-all duration-300">
                                                    <ArrowRight size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })()}
                </div>
            </div>
        </section>
    );
}
