'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { Ticket, Search, CalendarClock, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { TicketCard } from '@/components/TickectCard'; // Correct path
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchUserTickets, checkAuth } from '@/store/slices/authslice';

type FilterStatus = 'all' | 'pending' | 'completed' | 'expired';

export default function TicketsPage() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { user, tickets = [], isLoading: authLoading } = useAppSelector((state) => state.auth);

    // Local loading state for initial fetch
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        const init = async () => {
            if (!user) {
                await dispatch(checkAuth());
            }
            await dispatch(fetchUserTickets());
            setFetching(false);
        };
        init();
    }, [dispatch, user]);

    useEffect(() => {
        if (!fetching && !user && !authLoading) {
            router.push('/auth');
        }
    }, [user, fetching, router, authLoading]);


    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');

    const filteredTickets = useMemo(() => {
        if (!tickets) return [];
        let filtered = [...tickets];

        // Filter by search
        if (searchTerm) {
            const lower = searchTerm.toLowerCase();
            filtered = filtered.filter(t =>
                t.event.title.toLowerCase().includes(lower) ||
                t.event.venue?.name?.toLowerCase().includes(lower) ||
                t.event.ticket?.name.toLowerCase().includes(lower)
            );
        }

        // Filter by Status (Date Logic)
        const now = new Date();

        if (filterStatus !== 'all') {
            filtered = filtered.filter(t => {
                const eventDate = new Date(t.event.startDate);
                const eventEndDate = t.event.endDate ? new Date(t.event.endDate) : null;

                // Use endDate if available, otherwise assume 24h duration from start
                const effectiveEnd = (eventEndDate && !isNaN(eventEndDate.getTime()))
                    ? eventEndDate
                    : new Date(eventDate.getTime() + 86400000); // +24h

                if (filterStatus === 'pending') { // Upcoming or Ongoing
                    return effectiveEnd >= now && t.status === 'CONFIRMED';
                }
                if (filterStatus === 'completed') { // Past
                    return effectiveEnd < now && t.status === 'CONFIRMED';
                }
                if (filterStatus === 'expired') {
                    // Could be based on date or explicit status
                    return t.status !== 'CONFIRMED';
                }
                return true;
            });
        }

        return filtered;
    }, [tickets, searchTerm, filterStatus]);

    if (fetching || authLoading) {
        return (
            <div className="min-h-screen container mx-auto px-4 pt-24 flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen pt-24 pb-12 container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
                        <Ticket className="text-primary" size={36} /> My Tickets
                    </h1>
                    <p className="text-gray-400">Manage your upcoming bookings and past events.</p>
                </div>

                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by event or venue..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:border-primary/50 outline-none transition-all"
                    />
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 mb-8">
                <button
                    onClick={() => setFilterStatus('all')}
                    className={`px-4 py-2 rounded-full text-sm font-bold border transition-all ${filterStatus === 'all' ? 'bg-white text-black border-white' : 'bg-transparent text-gray-400 border-white/10 hover:text-white'}`}
                >
                    All Tickets
                </button>
                <button
                    onClick={() => setFilterStatus('pending')}
                    className={`px-4 py-2 rounded-full text-sm font-bold border transition-all flex items-center gap-2 ${filterStatus === 'pending' ? 'bg-primary text-black border-primary' : 'bg-transparent text-gray-400 border-white/10 hover:text-white'}`}
                >
                    <Clock size={14} /> Upcoming
                </button>
                <button
                    onClick={() => setFilterStatus('completed')}
                    className={`px-4 py-2 rounded-full text-sm font-bold border transition-all flex items-center gap-2 ${filterStatus === 'completed' ? 'bg-green-500/20 text-green-400 border-green-500/50' : 'bg-transparent text-gray-400 border-white/10 hover:text-white'}`}
                >
                    <CheckCircle size={14} /> Past
                </button>
            </div>

            {filteredTickets.length === 0 ? (
                <div className="text-center py-24 bg-white/5 rounded-3xl border border-dashed border-white/10">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CalendarClock className="text-gray-600" size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No tickets found</h3>
                    <p className="text-gray-500 mb-6 font-medium">
                        {searchTerm || filterStatus !== 'all' ? 'Try adjusting your filters.' : "You haven't booked any events yet."}
                    </p>
                    {filterStatus === 'all' && !searchTerm && (
                        <button onClick={() => router.push('/')} className="px-6 py-2 bg-primary text-black font-bold rounded-full hover:bg-primary/90 transition-all">
                            Browse Events
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
                    {filteredTickets.map((ticket) => (
                        <TicketCard key={ticket.id} ticket={ticket} />
                    ))}
                </div>
            )}
        </div>
    );
};
