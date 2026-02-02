
import React from 'react';
import { MoreVertical, Users, Plus, Filter, ArrowUpRight } from 'lucide-react';

const events = [
    { id: 1, name: 'Sun & Bass Music Festival', date: 'Sept 12, 2024', location: 'Olbia, Italy', tickets: '850/1000', sales: '₹42,500', status: 'Active' },
    { id: 2, name: 'AI Builders Meetup', date: 'Oct 05, 2024', location: 'San Francisco, CA', tickets: '120/150', sales: '₹6,000', status: 'Active' },
    { id: 3, name: 'Hive Design Workshop', date: 'Oct 15, 2024', location: 'Online Event', tickets: '45/100', sales: '₹0', status: 'Draft' },
    { id: 4, name: 'Annual Tech Gala', date: 'Aug 30, 2024', location: 'New York City', tickets: '500/500', sales: '₹25,000', status: 'Completed' },
];

interface EventsListProps {
    onCreateNew: () => void;
}

const EventsList: React.FC<EventsListProps> = ({ onCreateNew }) => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-text-main">Manage Your Events</h2>
                    <p className="text-text-muted">Total of {events.length} events organized</p>
                </div>
                <div className="flex gap-4">
                    <button className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-xl text-text-secondary font-semibold hover:bg-background">
                        <Filter size={18} />
                        Filters
                    </button>
                    <button
                        onClick={onCreateNew}
                        className="flex items-center gap-2 px-6 py-2 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-hover transition-all"
                    >
                        <Plus size={18} />
                        Create Event
                    </button>
                </div>
            </div>

            <div className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-background border-b border-border">
                        <tr>
                            <th className="px-8 py-5 text-xs font-bold text-text-muted uppercase tracking-wider">Event Details</th>
                            <th className="px-6 py-5 text-xs font-bold text-text-muted uppercase tracking-wider">Tickets Sold</th>
                            <th className="px-6 py-5 text-xs font-bold text-text-muted uppercase tracking-wider">Gross Sales</th>
                            <th className="px-6 py-5 text-xs font-bold text-text-muted uppercase tracking-wider">Status</th>
                            <th className="px-8 py-5"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {events.map((event) => (
                            <tr key={event.id} className="hover:bg-primary/5 transition-colors group">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center font-bold text-primary text-xl">
                                            {event.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-text-main group-hover:text-primary-hover transition-colors">{event.name}</p>
                                            <p className="text-sm text-text-muted">{event.date} • {event.location}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-6">
                                    <div className="flex items-center gap-2">
                                        <Users className="w-4 h-4 text-text-muted" />
                                        <span className="font-semibold text-text-secondary">{event.tickets}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-6 font-bold text-text-main">{event.sales}</td>
                                <td className="px-6 py-6">
                                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${event.status === 'Active' ? 'bg-green-100 text-green-700' :
                                        event.status === 'Completed' ? 'bg-blue-100 text-blue-700' :
                                            'bg-primary/10 text-primary'
                                        }`}>
                                        {event.status}
                                    </span>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-2 text-text-muted hover:text-primary hover:bg-primary/10 rounded-lg">
                                            <ArrowUpRight size={18} />
                                        </button>
                                        <button className="p-2 text-text-muted hover:text-text-main">
                                            <MoreVertical size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EventsList;
