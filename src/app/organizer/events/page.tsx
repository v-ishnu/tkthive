"use client"
import React, { useEffect } from 'react';
import { MoreVertical, Users, Plus, Filter, ArrowUpRight } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useRouter } from 'next/navigation';
import { fetchMyOrganizations, fetchOrganizerDetails } from '@/store/slices/organizerSlice';

const EventsList: React.FC = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { selectedOrganization, organizations } = useAppSelector((state) => state.organizer);
    const events = selectedOrganization?.events || [];

    // Fetch organizations on mount if empty
    useEffect(() => {
        if (organizations.length === 0) {
            dispatch(fetchMyOrganizations());
        }
    }, [dispatch, organizations.length]);

    // Fetch details (events) when organization is selected or on mount
    useEffect(() => {
        if (selectedOrganization?.id) {
            dispatch(fetchOrganizerDetails(selectedOrganization.id));
        }
    }, [dispatch, selectedOrganization?.id]);

    const handleCreateNew = () => {
        router.push('/organizer/create-event');
    };

    const handleManageEvent = (eventId: string) => {
        router.push(`/organizer/events/${eventId}`);
    };

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
                        onClick={handleCreateNew}
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
                        {events.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-8 py-10 text-center text-text-muted">
                                    No events found. Create your first event!
                                </td>
                            </tr>
                        ) : (
                            events.map((event: any) => (
                                <tr
                                    key={event.id}
                                    className="hover:bg-primary/5 transition-colors group cursor-pointer"
                                    onClick={() => handleManageEvent(event.id)}
                                >
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center font-bold text-primary text-xl overflow-hidden">
                                                {event.imageUrl ? (
                                                    <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
                                                ) : (
                                                    event.title.charAt(0)
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-bold text-text-main group-hover:text-primary-hover transition-colors">{event.title}</p>
                                                <p className="text-sm text-text-muted">
                                                    {new Date(event.startDate).toLocaleDateString()} • {event.venue?.city || 'Online'}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="flex items-center gap-2">
                                            <Users className="w-4 h-4 text-text-muted" />
                                            <span className="font-semibold text-text-secondary">
                                                {event.totalBooked || 0} / {event.totalTickets || '∞'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 font-bold text-text-main">
                                        {/* calc revenue if price is simple, else just show Tickets Sold * Price or N/A */}
                                        ₹ --
                                    </td>
                                    <td className="px-6 py-6">
                                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${event.isLive ? 'bg-green-100 text-green-700' :
                                            !event.isRegistrationOpen ? 'bg-red-100 text-red-700' :
                                                'bg-blue-100 text-blue-700'
                                            }`}>
                                            {event.isLive ? 'Live' : (event.isRegistrationOpen ? 'Upcoming' : 'Closed')}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleManageEvent(event.id); }}
                                                className="p-2 text-text-muted hover:text-primary hover:bg-primary/10 rounded-lg"
                                            >
                                                <ArrowUpRight size={18} />
                                            </button>
                                            <button className="p-2 text-text-muted hover:text-text-main">
                                                <MoreVertical size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EventsList;
