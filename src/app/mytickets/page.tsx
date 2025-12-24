'use client';
import React, { useState, useMemo } from 'react';
import { Ticket, Search, CalendarClock, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { User as UserType } from '@/types';
import { TicketCard } from '@/components/TickectCard';

import { useRouter } from 'next/navigation';

type FilterStatus = 'all' | 'pending' | 'completed' | 'expired';

export default function TicketsPage() {
    const [user, setUser] = useState<UserType | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    React.useEffect(() => {
        const savedUser = localStorage.getItem('user_data');
        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (e) {
                console.error("Failed to parse user", e);
            }
        } else {
            router.push('/auth');
        }
        setLoading(false);
    }, []);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');

    const filteredTickets = useMemo(() => {
        if (!user) return [];
        let tickets = user.tickets;

        // Filter by search
        if (searchTerm) {
            const lower = searchTerm.toLowerCase();
            tickets = tickets.filter(t =>
                t.eventTitle.toLowerCase().includes(lower) ||
                t.eventVenue.toLowerCase().includes(lower) ||
                t.ticketType.toLowerCase().includes(lower)
            );
        }

        // Filter by Status (Date Logic)
        const now = new Date();

        if (filterStatus !== 'all') {
            tickets = tickets.filter(t => {
                // Helper to parse custom date format "Fri, Nov 24, 2025, 20:00"
                // Simple fallback logic if date parsing fails
                let eventDate = new Date(t.eventDate);
                if (isNaN(eventDate.getTime())) {
                    // Try parsing manual string
                    try {
                        const parts = t.eventDate.split(', ');
                        if (parts.length >= 3) {
                            // "Nov 24, 2025 20:00"
                            eventDate = new Date(`${parts[1]}, ${parts[2]}`);
                        }
                    } catch (e) { }
                }
                if (isNaN(eventDate.getTime())) return true; // Keep if cant parse

                if (filterStatus === 'pending') { // Upcoming
                    return eventDate >= now;
                }
                if (filterStatus === 'completed' || filterStatus === 'expired') { // Past
                    return eventDate < now;
                }
                return true;
            });
        }

        return tickets;
    }, [user, searchTerm, filterStatus]);

    if (loading) {
        return <div className="min-h-screen container mx-auto px-4 pt-24 text-white">Loading...</div>;
    }

    if (!user || !user.tickets) return null; // Safe guard

    return (
        <div className="min-h-screen pt-12 pb-12 container mx-auto px-4">
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
                    <Clock size={14} /> Pending (Upcoming)
                </button>
                <button
                    onClick={() => setFilterStatus('completed')}
                    className={`px-4 py-2 rounded-full text-sm font-bold border transition-all flex items-center gap-2 ${filterStatus === 'completed' ? 'bg-green-500/20 text-green-400 border-green-500/50' : 'bg-transparent text-gray-400 border-white/10 hover:text-white'}`}
                >
                    <CheckCircle size={14} /> Attended
                </button>
                <button
                    onClick={() => setFilterStatus('expired')}
                    className={`px-4 py-2 rounded-full text-sm font-bold border transition-all flex items-center gap-2 ${filterStatus === 'expired' ? 'bg-red-500/20 text-red-400 border-red-500/50' : 'bg-transparent text-gray-400 border-white/10 hover:text-white'}`}
                >
                    <AlertCircle size={14} /> Expired
                </button>
            </div>

            {filteredTickets.length === 0 ? (
                <div className="text-center py-24 bg-white/5 rounded-3xl border border-dashed border-white/10">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CalendarClock className="text-gray-600" size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No tickets found</h3>
                    <p className="text-gray-500 mb-6">No tickets match your current filters.</p>
                    {filterStatus !== 'all' && (
                        <button onClick={() => setFilterStatus('all')} className="text-primary hover:underline font-bold text-sm">
                            View All Tickets
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTickets.map((ticket) => (
                        <TicketCard key={ticket.id} ticket={ticket} />
                    ))}
                </div>
            )}
        </div>
    );
};
