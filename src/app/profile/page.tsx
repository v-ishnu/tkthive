'use client'

import React, { useState } from 'react';
import { Ticket, Star, Heart, Settings, MapPin, Grid, List, Zap, MessageCircle } from 'lucide-react';
import { User as UserType } from '@/types';
import { TicketCard } from '@/components/TickectCard';


import { useRouter } from 'next/navigation';

export default function ProfilePage() {
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
    const [activeTab, setActiveTab] = useState<'attended' | 'saved' | 'reviews'>('attended');

    // Filter attended tickets
    const attendedTickets = React.useMemo(() => {
        if (!user) return [];
        const now = new Date();
        return user.tickets.filter(t => {
            let eventDate = new Date(t.eventDate);
            if (isNaN(eventDate.getTime())) {
                try {
                    const parts = t.eventDate.split(', ');
                    if (parts.length >= 3) {
                        eventDate = new Date(`${parts[1]}, ${parts[2]}`);
                    }
                } catch (e) { }
            }
            if (isNaN(eventDate.getTime())) return false;
            return eventDate < now;
        });
    }, [user]);

    if (loading) {
        return <div className="min-h-screen bg-dark text-white flex items-center justify-center">Loading...</div>;
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-dark text-white pb-20 relative">
            {/* Background Pattern */}


            {/* Hero Banner Section */}
            <div className="relative h-80 w-full overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src={user?.coverImage || "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop"}
                        alt="Cover"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-black/30" />
                </div>
            </div>

            <div className="container mx-auto px-4 relative z-10 -mt-24">
                <div className="flex flex-col md:flex-row items-end md:items-center gap-8 mb-12">

                    {/* Profile Avatar */}
                    <div className="relative group shrink-0">
                        <div className="w-40 h-40 rounded-[2rem] border-4 border-dark bg-dark overflow-hidden shadow-2xl relative z-10">
                            <img
                                src={user?.avatar}
                                alt={user?.name}
                                className="w-full h-full object-cover transition-transform group-hover:scale-110"
                            />
                        </div>
                        <div className="absolute bottom-4 -right-2 bg-primary text-black font-black text-xs px-2 py-1 rounded-lg border-4 border-dark z-20 uppercase tracking-wider">
                            {user?.role || 'Pro'}
                        </div>
                    </div>

                    {/* Profile Info */}
                    <div className="flex-1 pb-4">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                            <div>
                                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 flex items-center gap-3">
                                    {user?.name}
                                    <Zap className="text-primary fill-primary" size={28} />
                                </h1>
                                <div className="flex items-center gap-4 text-gray-400 text-sm md:text-base">
                                    <span className="flex items-center gap-1.5">
                                        <MapPin size={16} className="text-primary" /> {user?.location || 'Mumbai, India'}
                                    </span>
                                    <span className="w-1 h-1 bg-gray-600 rounded-full" />
                                    <span>Event Enthusiast</span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <button className="px-6 py-2.5 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors shadow-lg">
                                    Edit Profile
                                </button>
                                <button className="px-6 py-2.5 bg-white/10 text-white font-bold rounded-xl border border-white/10 hover:bg-white/20 transition-colors backdrop-blur-md">
                                    Get in touch
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Stats Block (Desktop) */}
                    <div className="hidden lg:flex gap-8 items-center bg-card/50 backdrop-blur-md p-6 rounded-3xl border border-white/10">
                        <div className="text-center">
                            <div className="text-2xl font-black text-white">{user?.stats?.followers || '2,985'}</div>
                            <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Followers</div>
                        </div>
                        <div className="w-px h-8 bg-white/10" />
                        <div className="text-center">
                            <div className="text-2xl font-black text-white">{user?.stats?.following || '132'}</div>
                            <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Following</div>
                        </div>
                        <div className="w-px h-8 bg-white/10" />
                        <div className="text-center">
                            <div className="text-2xl font-black text-white">{user?.tickets.length}</div>
                            <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Events</div>
                        </div>
                    </div>
                </div>

                {/* Content Tabs */}
                <div className="flex items-center gap-8 border-b border-white/10 mb-12 overflow-x-auto scrollbar-hide">
                    {[
                        { id: 'attended', label: 'Attended', icon: Ticket, count: attendedTickets.length },
                        { id: 'saved', label: 'Saved', icon: Heart, count: 12 },
                        { id: 'reviews', label: 'Reviews', icon: MessageCircle, count: 5 },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`pb-4 px-2 text-sm font-bold uppercase tracking-wider flex items-center gap-2 transition-all border-b-2 ${activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-white'}`}
                        >
                            <tab.icon size={16} />
                            {tab.label}
                            <span className="bg-white/10 px-1.5 py-0.5 rounded text-[10px] text-gray-300">{tab.count}</span>
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                {activeTab === 'attended' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {attendedTickets.length === 0 ? (
                            <div className="text-center py-24 bg-card/30 rounded-[2rem] border border-dashed border-white/10">
                                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Ticket className="text-gray-600" size={32} />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">No attended events</h3>
                                <p className="text-gray-500 mb-8 max-w-md mx-auto">You haven't attended any events yet.</p>
                                <button className="text-primary font-bold hover:underline">Explore Events</button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {attendedTickets.map((ticket) => (
                                    <div key={ticket.id} className="bg-card rounded-3xl overflow-hidden border border-white/5 hover:border-white/20 transition-all group cursor-pointer flex flex-col">
                                        <div className="h-48 bg-gray-800 relative">
                                            <img
                                                src={ticket.eventImage || `https://picsum.photos/seed/${ticket.id}/400/300`}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                alt={ticket.eventTitle}
                                            />
                                            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold border border-white/10 uppercase tracking-wider">
                                                Attended
                                            </div>
                                        </div>
                                        <div className="p-6 flex-1 flex flex-col">
                                            <div className="text-xs font-bold text-primary uppercase tracking-wider mb-2">{ticket.ticketType}</div>
                                            <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">{ticket.eventTitle}</h3>
                                            <div className="mt-auto space-y-2">
                                                <div className="flex items-center gap-2 text-gray-400 text-sm">
                                                    <List size={14} className="text-primary" />
                                                    <span>{ticket.eventDate}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-400 text-sm">
                                                    <MapPin size={14} className="text-primary" />
                                                    <span className="line-clamp-1">{ticket.eventVenue}</span>
                                                </div>
                                            </div>

                                            <button className="mt-6 w-full py-3 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white hover:text-black transition-all text-sm flex items-center justify-center gap-2">
                                                <Star size={16} /> Write a Review
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'saved' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Mock Saved Cards */}
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-card rounded-3xl overflow-hidden border border-white/5 hover:border-white/20 transition-all group cursor-pointer">
                                <div className="h-48 bg-gray-800 relative">
                                    <img src={`https://picsum.photos/seed/${i + 100}/400/300`} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" alt="" />
                                    <div className="absolute top-4 right-4 bg-primary text-black p-2 rounded-full">
                                        <Heart size={16} fill="currentColor" />
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="text-xs font-bold text-primary uppercase tracking-wider mb-2">Concert</div>
                                    <h3 className="text-xl font-bold text-white mb-1">Neon Lights Festival</h3>
                                    <p className="text-gray-400 text-sm">Mumbai • Dec 2025</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
};