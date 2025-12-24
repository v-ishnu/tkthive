'use client'
import React, { useState } from 'react';
import { ArrowLeft, Calendar, MapPin, Clock, Share2, Shield, Users, Tag, AlertCircle, Trophy, Play, Mic2, Star, Award, CheckCircle, Map } from 'lucide-react';
import { EventData } from '../../../types';
import { AdSection } from '@/components/home/Adsection';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { MOCK_EVENTS } from '@/constants';
import { EventReviews } from '@/components/events/EventReviews';


export default function EventDetails() {
    const [activeTab, setActiveTab] = useState<'details' | 'prizes' | 'guests' | 'sponsors' | 'live' | 'results' | 'location'>('details');

    // Determine available tabs based on data

    const { id } = useParams();
    const router = useRouter();
    const eventId = id as string;

    const event = MOCK_EVENTS.find((event) => event.id === eventId);

    if (!event) {
        return <div>Event not found</div>;
    }
    const showPrizes = event.prizes && event.prizes.length > 0;
    const showGuests = event.guests && event.guests.length > 0;
    const showSponsors = event.sponsors && event.sponsors.length > 0;
    const showLive = event.isLive;
    const showResults = event.results && event.results.length > 0;


    const onBack = () => {
        router.back();
    };

    const onBook = (event: EventData) => {
        // Handle booking logic
        router.push(`/events/${event.id}/registration`);
    };

    // Calculate Completion Status
    const now = new Date();
    let isEventCompleted = false;
    try {
        const dateStr = event.date.replace(/at/i, '');
        const eventDate = new Date(dateStr);
        if (!isNaN(eventDate.getTime()) && eventDate < now) {
            isEventCompleted = true;
        }
    } catch (e) { }

    return (
        <div className="min-h-screen bg-dark pb-0">
            {/* Header Image Area */}
            <div className="relative h-[450px] md:h-[500px] w-full overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center blur-sm opacity-60 scale-105"
                    style={{ backgroundImage: `url(${event.imageUrl})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/40 to-black/30" />

                <div className="relative h-full container mx-auto px-4 flex flex-col justify-between pt-24 pb-8 gap-4">
                    <button
                        onClick={onBack}
                        className="self-start p-3 bg-black/40 backdrop-blur-md border border-white/10 rounded-full text-white hover:bg-white/10 transition-all group"
                    >
                        <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                    </button>

                    <div className="pb-8">
                        <div className="flex flex-wrap gap-3 mb-6">
                            <span className="bg-primary text-black px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                                {event.category || 'Event'}
                            </span>
                            {event.isLive && (
                                <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide animate-pulse flex items-center gap-2">
                                    <span className="w-2 h-2 bg-white rounded-full" /> LIVE NOW
                                </span>
                            )}
                            {event.accessType === 'private' && (
                                <span className="bg-red-500/20 border border-red-500/50 text-red-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1">
                                    <Shield size={12} /> {event.organization ? `${event.organization} Only` : 'Private'}
                                </span>
                            )}
                        </div>

                        <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold text-white mb-6 drop-shadow-2xl max-w-4xl leading-tight">{event.title}</h1>

                        <div className="flex flex-col md:flex-row gap-4 md:gap-6 text-gray-200">
                            <div className="flex items-center gap-3 bg-black/40 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/10 w-fit">
                                <Calendar className="text-primary" size={20} />
                                <span className="text-sm md:text-lg font-medium">{event.date}</span>
                            </div>
                            <div className="flex items-center gap-3 bg-black/40 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/10 w-fit">
                                <MapPin className="text-primary" size={20} />
                                <span className="text-sm md:text-lg font-medium">{event.venue}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 mt-8 flex flex-col lg:flex-row gap-12 relative z-10">

                {/* Main Content */}
                <div className="lg:w-2/3 order-2 lg:order-1">
                    {/* ... other content ... */}

                    {/* Tabs Navigation */}
                    <div className="flex gap-4 mb-8 overflow-x-auto pb-2 scrollbar-hide border-b border-white/10">
                        <button
                            onClick={() => setActiveTab('details')}
                            className={`px-4 py-2 text-sm font-bold uppercase tracking-wide transition-colors whitespace-nowrap border-b-2 ${activeTab === 'details' ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-white'}`}
                        >
                            Overview
                        </button>
                        <button
                            onClick={() => setActiveTab('location')}
                            className={`px-4 py-2 text-sm font-bold uppercase tracking-wide transition-colors whitespace-nowrap border-b-2 flex items-center gap-2 ${activeTab === 'location' ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-white'}`}
                        >
                            <Map size={14} /> Location
                        </button>
                        {showLive && (
                            <button
                                onClick={() => setActiveTab('live')}
                                className={`px-4 py-2 text-sm font-bold uppercase tracking-wide transition-colors whitespace-nowrap border-b-2 flex items-center gap-2 ${activeTab === 'live' ? 'border-red-500 text-red-500' : 'border-transparent text-gray-400 hover:text-white'}`}
                            >
                                <Play size={14} /> Live Stream
                            </button>
                        )}
                        {showResults && (
                            <button
                                onClick={() => setActiveTab('results')}
                                className={`px-4 py-2 text-sm font-bold uppercase tracking-wide transition-colors whitespace-nowrap border-b-2 ${activeTab === 'results' ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-white'}`}
                            >
                                Results
                            </button>
                        )}
                        {showPrizes && (
                            <button
                                onClick={() => setActiveTab('prizes')}
                                className={`px-4 py-2 text-sm font-bold uppercase tracking-wide transition-colors whitespace-nowrap border-b-2 ${activeTab === 'prizes' ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-white'}`}
                            >
                                Prizes
                            </button>
                        )}
                        {showGuests && (
                            <button
                                onClick={() => setActiveTab('guests')}
                                className={`px-4 py-2 text-sm font-bold uppercase tracking-wide transition-colors whitespace-nowrap border-b-2 ${activeTab === 'guests' ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-white'}`}
                            >
                                Guests & Artists
                            </button>
                        )}
                        {showSponsors && (
                            <button
                                onClick={() => setActiveTab('sponsors')}
                                className={`px-4 py-2 text-sm font-bold uppercase tracking-wide transition-colors whitespace-nowrap border-b-2 ${activeTab === 'sponsors' ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-white'}`}
                            >
                                Sponsors
                            </button>
                        )}
                    </div>

                    {/* Tab Content */}
                    <div className="min-h-[400px]">
                        {activeTab === 'details' && (
                            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <section>
                                    <h2 className="text-2xl font-bold text-white mb-4">About This Event</h2>
                                    <p className="text-gray-300 text-lg leading-relaxed">
                                        {event.description}
                                    </p>
                                    {event.accessType === 'private' && (
                                        <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-xl flex items-start gap-3">
                                            <AlertCircle className="text-yellow-500 shrink-0 mt-0.5" />
                                            <div>
                                                <h4 className="font-bold text-white">Restricted Access</h4>
                                                <p className="text-sm text-gray-400 mt-1">
                                                    This event is exclusive to members of <strong>{event.organization || 'the organization'}</strong>.
                                                    Please ensure you carry valid identification (Student ID/Employee ID) for entry.
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </section>

                                {event.subEvents && event.subEvents.length > 0 && (
                                    <section>
                                        <h2 className="text-2xl font-bold text-white mb-6">Agenda</h2>
                                        <div className="relative border-l border-white/10 ml-3 space-y-8 pl-8 py-2">
                                            {event.subEvents.map((sub) => (
                                                <div key={sub.id} className="relative group">
                                                    <div className="absolute -left-[39px] top-1 w-5 h-5 bg-dark border-2 border-primary rounded-full group-hover:bg-primary transition-colors" />
                                                    <div className="bg-card border border-white/5 hover:border-primary/30 p-5 rounded-2xl transition-all">
                                                        <div className="flex items-center gap-2 text-primary font-mono text-sm mb-2">
                                                            <Clock size={14} />
                                                            <span>{sub.time}</span>
                                                        </div>
                                                        <h3 className="text-xl font-bold text-white mb-1">{sub.title}</h3>
                                                        <p className="text-gray-400 text-sm">{sub.description}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                )}
                            </div>
                        )}

                        {activeTab === 'location' && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="bg-card border border-white/10 rounded-2xl overflow-hidden p-1">
                                    <div className="relative w-full h-[400px] bg-white/5 rounded-xl overflow-hidden">
                                        <iframe
                                            width="100%"
                                            height="100%"
                                            src={`https://maps.google.com/maps?q=${encodeURIComponent(event.venue)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                                            style={{ filter: 'grayscale(1) invert(1) contrast(0.8)' }} // Dark mode map hack
                                            frameBorder="0"
                                            scrolling="no"
                                        />
                                    </div>
                                </div>
                                <div className="mt-6 flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/10 flex-col md:flex-row gap-4 text-center md:text-left">
                                    <div className="flex items-center gap-3 flex-col md:flex-row">
                                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                                            <MapPin className="text-primary" size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white">{event.venue}</h3>
                                            <p className="text-sm text-gray-400">Get directions and plan your trip</p>
                                        </div>
                                    </div>
                                    <a
                                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.venue)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-6 py-2 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors w-full md:w-auto"
                                    >
                                        Open in Maps
                                    </a>
                                </div>
                            </div>
                        )}

                        {activeTab === 'prizes' && event.prizes && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {event.prizes.map((prize, idx) => (
                                    <div key={idx} className="bg-gradient-to-br from-card to-white/5 border border-white/10 p-6 rounded-2xl flex items-center gap-6">
                                        <div className={`w-16 h-16 rounded-full flex items-center justify-center shrink-0 ${idx === 0 ? 'bg-yellow-500 text-black' : idx === 1 ? 'bg-gray-400 text-black' : 'bg-orange-700 text-white'}`}>
                                            <Trophy size={32} />
                                        </div>
                                        <div>
                                            <div className="text-primary font-bold tracking-widest uppercase text-sm mb-1">{prize.place}</div>
                                            <div className="text-3xl font-bold text-white mb-1">{prize.amount}</div>
                                            <div className="text-gray-400 text-sm">{prize.description}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'guests' && event.guests && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {event.guests.map((guest, idx) => (
                                    <div key={idx} className="group relative overflow-hidden rounded-2xl aspect-[4/3] bg-card border border-white/10">
                                        {guest.imageUrl && <img src={guest.imageUrl} alt={guest.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                                        <div className="absolute bottom-0 p-6">
                                            <div className="text-primary font-bold text-xs uppercase mb-1 flex items-center gap-1">
                                                <Mic2 size={12} /> {guest.role}
                                            </div>
                                            <h3 className="text-2xl font-bold text-white">{guest.name}</h3>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'live' && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="aspect-video bg-black rounded-2xl border border-white/10 flex items-center justify-center relative overflow-hidden group cursor-pointer">
                                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop')] bg-cover opacity-50" />
                                    <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center z-10 group-hover:scale-110 transition-transform shadow-[0_0_30px_rgba(255,214,10,0.4)]">
                                        <Play size={32} className="ml-1 text-black" fill="currentColor" />
                                    </div>
                                    <div className="absolute top-4 right-4 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-2 animate-pulse">
                                        <span className="w-2 h-2 bg-white rounded-full" /> LIVE
                                    </div>
                                </div>
                                <div className="mt-6 flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/10">
                                    <div>
                                        <h3 className="font-bold text-white">Watch on Platform</h3>
                                        <p className="text-sm text-gray-400">Join the chat and interact with 12k+ viewers</p>
                                    </div>
                                    <button className="px-6 py-2 bg-white text-black font-bold rounded-lg hover:bg-gray-200">
                                        Open Stream
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'results' && event.results && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {event.results.map((result, idx) => (
                                    <div key={idx} className="bg-card border border-white/10 p-6 rounded-2xl flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">
                                                #{idx + 1}
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-white">{result.winner}</h3>
                                                <p className="text-gray-400 text-sm">{result.details}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-mono font-bold text-primary">{result.score}</div>
                                            <div className="text-xs text-gray-500 uppercase tracking-wider">Score</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'sponsors' && event.sponsors && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {event.sponsors.map((sponsor, idx) => (
                                    <div key={idx} className="bg-white p-6 rounded-2xl flex flex-col items-center justify-center gap-4 hover:scale-105 transition-transform">
                                        {/* Placeholder for Logo */}
                                        <div className="text-black font-bold text-xl">{sponsor.name}</div>
                                        <div className="px-2 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold uppercase rounded">{sponsor.tier} Partner</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Simple Tags */}
                    <div className="mt-12 pt-8 border-t border-white/10">
                        <div className="flex flex-wrap gap-2">
                            {['Live', 'Music', 'Festival', 'Party', '2025'].map(tag => (
                                <span key={tag} className="px-4 py-2 bg-white/5 rounded-full text-sm text-gray-400 hover:text-white border border-transparent hover:border-white/20 transition-all cursor-pointer">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>
                    <EventReviews />
                </div>

                {/* Sidebar Booking Card */}
                <div className="lg:w-1/3 relative z-20 order-1 lg:order-2">
                    <div className="lg:sticky top-24 space-y-6">

                        {/* Booking Info Card */}
                        <div className="bg-card/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
                            <div className="flex justify-between items-center mb-6 pb-6 border-b border-white/10">
                                <div>
                                    <p className="text-gray-400 text-sm">Starting from</p>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-3xl font-bold text-primary">{event.price}</span>
                                        <span className="text-gray-500 text-sm">/ person</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="p-3 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors">
                                        <Share2 size={20} />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4 mb-8 hidden md:block">
                                <div className="flex items-center gap-3 text-gray-300">
                                    <Users size={18} className="text-gray-500" />
                                    <span>Individual & Team Booking</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-300">
                                    <Tag size={18} className="text-gray-500" />
                                    <span>Mobile e-ticket allowed</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-300">
                                    <Shield size={18} className="text-gray-500" />
                                    <span>Secure checkout</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-300">
                                    <CheckCircle size={18} className="text-green-500" />
                                    <span>Verified Organizer</span>
                                </div>
                            </div>

                            <button
                                onClick={() => !isEventCompleted && onBook(event)}
                                disabled={isEventCompleted}
                                className={`w-full py-4 font-bold text-lg rounded-xl transition-all shadow-[0_0_20px_rgba(255,214,10,0.2)] active:scale-95 flex items-center justify-center gap-2 ${isEventCompleted ? 'bg-gray-600 cursor-not-allowed opacity-70 shadow-none' : 'bg-primary hover:bg-primary-hover text-black'}`}
                            >
                                {isEventCompleted ? 'Event Completed' : 'Book Now'}
                            </button>

                            <p className="text-center text-xs text-gray-500 mt-4">
                                By booking, you agree to our Terms & Conditions.
                            </p>
                        </div>

                        {/* Organizer Info Card */}
                        <div className="bg-card border border-white/10 rounded-3xl p-6 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10">
                                <img
                                    src={event.organizer.imageUrl || `https://ui-avatars.com/api/?name=${event.organizer.name}&background=random`}
                                    alt={event.organizer.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide font-bold">Organized by</p>
                                <h4 className="font-bold text-white line-clamp-1">{event.organizer.name}</h4>
                                {event.organizer.description && (
                                    <p className="text-xs text-gray-400 mt-1 line-clamp-1">{event.organizer.description}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Ad Section */}
            <div className="container mx-auto px-4 mt-20 mb-12">
                <AdSection
                    title="Sponsorship Opportunities"
                    description="Want to see your brand here? Partner with the biggest events in the region."
                    cta="Contact Sales"
                    align="left"
                />
            </div>
        </div >
    );
};
