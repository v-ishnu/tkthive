import { SubEvent } from "@/types";

export default function EventSchedule({ subEvents }: { subEvents: SubEvent[] }) {
    if (!subEvents || subEvents.length === 0) return <p className="text-gray-400">No schedule available.</p>;

    // Group by date
    const groupedEvents = subEvents.reduce((acc, event) => {
        const date = event.date;
        if (!acc[date]) acc[date] = [];
        acc[date].push(event);
        return acc;
    }, {} as Record<string, SubEvent[]>);

    const sortedDates = Object.keys(groupedEvents).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    return (
        <div className="space-y-8">
            {sortedDates.map((date) => (
                <div key={date} className="relative pl-8 border-l border-white/10">
                    <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-brand-primary/50" />
                    <h3 className="text-xl font-bold text-white mb-4">
                        {new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </h3>
                    <div className="space-y-4">
                        {groupedEvents[date].map((event) => (
                            <div key={event.id} className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10 hover:border-brand-primary/30 transition-all">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                                    <div>
                                        <h4 className="font-semibold text-lg text-white">{event.title}</h4>
                                        <p className="text-gray-400 text-sm">{event.description}</p>
                                    </div>
                                    <div className="flex items-center gap-2 text-brand-primary bg-brand-primary/10 px-3 py-1 rounded-full w-fit">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        <span className="text-sm font-medium">{event.time}</span>
                                        {event.location && <span className="text-xs text-gray-500 ml-2">({event.location})</span>}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
