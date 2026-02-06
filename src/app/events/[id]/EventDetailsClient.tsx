'use client'
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, MapPin, Clock, Share2, Shield, Users, Tag, AlertCircle, Trophy, Play, Mic2, Star, Award, CheckCircle, Map, FileText, Send, LayoutList, Loader2, Megaphone, Info as InfoIcon } from 'lucide-react';
import { EventData, TicketTier } from '../../../types';
import { ShareModal } from '@/components/ShareModal';
import { AdSection } from '@/components/home/Adsection';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

import { EventTabs } from '@/components/events/EventTabs';
import EventSchedule from '@/components/events/EventSchedule';
import EventDocs from '@/components/events/EventDocs';
import EventSubmissions from '@/components/events/EventSubmissions';
import { OrganizerProfile, OrganizerContact } from '@/components/events/OrganizerCard';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchEventById, clearEvent } from '@/store/slices/eventSlice';
import { RootState } from '@/store/store';
import { useToast } from '@/context/ToastContext';

export default function EventDetails() {
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);

    const dispatch = useAppDispatch();
    const { event, loading, error } = useAppSelector((state: RootState) => state.event);
    const { user } = useAppSelector((state: RootState) => state.auth);
    const { showToast } = useToast();

    const params = useParams();
    const router = useRouter();
    // Support both [id] and [slug] folder names during migration
    const eventSlug = (params.slug || params.id) as string;

    useEffect(() => {
        if (eventSlug) {
            dispatch(fetchEventById(eventSlug));
        }

        // Cleanup on unmount
        return () => {
            dispatch(clearEvent());
        }
    }, [eventSlug, dispatch]);


    if (loading) {
        return (
            <div className="min-h-screen bg-dark flex items-center justify-center">
                <Loader2 className="animate-spin text-primary" size={48} />
            </div>
        );
    }

    if (error || !event) {
        return (
            <div className="min-h-screen bg-dark flex flex-col items-center justify-center text-white gap-4">
                <AlertCircle className="text-red-500" size={48} />
                <h2 className="text-2xl font-bold">Event not found</h2>
                <p className="text-gray-400">{error || "We couldn't find the event you're looking for."}</p>
                <button
                    onClick={() => router.push('/events')}
                    className="px-6 py-2 bg-primary text-black rounded-full font-bold hover:bg-white transition-colors"
                >
                    Browse Events
                </button>
            </div>
        );
    }

    // Existing Logic for Tabs visibility
    const showPrizes = event.prizes && event.prizes.length > 0;
    const showGuests = event.guests && event.guests.length > 0;
    const showSponsors = event.sponsors && event.sponsors.length > 0;
    const showLive = event.isLive;
    const showResults = event.results && event.results.length > 0;
    const showSchedule = event.subEvents && event.subEvents.length > 0;
    const showDocs = event.documents && event.documents.length > 0;
    const showSubmissions = event.submissions && event.submissions.length > 0;

    const onBack = () => {
        router.back();
    };

    const onBook = (event: EventData) => {
        if (!user) {
            showToast("Please login to book tickets.", "error");
            router.push(`/auth?redirect=/events/${eventSlug}`);
            return;
        }
        // Handle booking logic
        router.push(`/events/${eventSlug}/registration`);
    };

    // Calculate Completion Status
    const now = new Date();
    let isEventCompleted = false;
    let isRegistrationClosed = false;

    try {
        // Prioritize endDate for completion check, fallback to date if explicit endDate is missing
        // assuming date might be a start date or range string that new Date() can parse
        const dateToCheck = event.endDate || event.date;
        const eventDate = new Date(dateToCheck);

        if (!isNaN(eventDate.getTime()) && eventDate < now) {
            isEventCompleted = true;
        }

        // Check registration status
        if (event.isRegistrationOpen === false) {
            isRegistrationClosed = true;
        }

    } catch (e) { }

    const isBookable = !isEventCompleted && !isRegistrationClosed;
    const buttonText = isEventCompleted ? 'Event Completed' : (isRegistrationClosed ? 'Registration Closed' : 'Book Now');


    return (
        <div className="min-h-screen bg-dark pb-0">
            {/* Header Image Area */}
            <div className="relative min-h-[450px] md:min-h-[600px] w-full overflow-hidden flex flex-col">
                <div
                    className="absolute inset-0 bg-cover bg-center blur-sm opacity-60 scale-105"
                    style={{ backgroundImage: `url(${event.imageUrl})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/40 to-black/30" />

                <div className="relative flex-1 container mx-auto px-4 flex flex-col justify-between pt-24 pb-8 gap-4">
                    <button
                        onClick={onBack}
                        className="self-start p-2 mt-4 bg-black/40 backdrop-blur-md border border-white/10 rounded-full text-white hover:bg-white/10 transition-all group"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
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

                        <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-4 drop-shadow-2xl max-w-4xl leading-tight">{event.title}</h1>

                        <div className="flex flex-col md:flex-row gap-3 md:gap-6 text-gray-200">
                            <div className="flex items-center gap-3 bg-black/40 backdrop-blur-sm px-3 py-2 md:px-4 rounded-xl border border-white/10 w-fit">
                                <Calendar className="text-primary" size={18} />
                                <span className="text-xs md:text-lg font-medium">{event.date}</span>
                            </div>
                            <div className="flex items-center gap-3 bg-black/40 backdrop-blur-sm px-3 py-2 md:px-4 rounded-xl border border-white/10 w-fit">
                                <MapPin className="text-primary" size={18} />
                                <span className="text-xs md:text-lg font-medium">{event.venue.name}, {event.venue.city}</span>
                            </div>
                        </div>

                        {/* Announcement & Info - Hero Section Placement */}
                        {(event.announcement || event.info) && (
                            <div className="mt-6 flex flex-col md:flex-row gap-4 max-w-5xl animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                                {event.announcement && (
                                    <div className="flex-1 p-3 bg-primary/20 backdrop-blur-md border border-primary/30 rounded-xl flex items-start gap-3 shadow-lg shadow-primary/5">
                                        <Megaphone className="text-primary shrink-0 mt-0.5 animate-pulse" size={16} />
                                        <div>
                                            <h4 className="font-bold text-primary text-xs md:text-sm mb-0.5 tracking-wide">ANNOUNCEMENT</h4>
                                            <p className="text-white text-xs md:text-sm">
                                                {event.announcement}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {event.info && (
                                    <div className="flex-1 p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl flex items-start gap-3">
                                        <InfoIcon className="text-blue-400 shrink-0 mt-0.5" size={16} />
                                        <div>
                                            <h4 className="font-bold text-blue-400 text-xs md:text-sm mb-0.5 tracking-wide">IMPORTANT INFO</h4>
                                            <p className="text-gray-200 text-xs md:text-sm whitespace-pre-line">
                                                {event.info}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 flex flex-col lg:flex-row gap-12 relative z-10">

                {/* Main Content */}
                <div className="lg:w-2/3 order-1">
                    {/* New Event Tabs Component */}
                    <EventTabs event={event} />
                </div>

                {/* Sidebar Booking Card */}
                <div className="lg:w-1/3 relative z-20 order-2">
                    <div className="lg:sticky top-24 space-y-6">

                        {/* Booking Info Card */}
                        <div className="hidden lg:block bg-card/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl order-1 lg:order-none mb-6 lg:mb-0">
                            <div className="flex justify-between items-center mb-6 pb-6 border-b border-white/10">
                                <div>
                                    <p className="text-gray-400 text-sm">Starting from</p>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-3xl font-bold text-primary">{event.price}</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setIsShareModalOpen(true)}
                                        className="p-3 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors"
                                    >
                                        <Share2 size={20} />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4 mb-8 hidden md:block">
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
                                onClick={() => isBookable && onBook(event)}
                                disabled={!isBookable}
                                className={`w-full py-4 font-bold text-lg rounded-xl transition-all shadow-[0_0_20px_rgba(255,214,10,0.2)] active:scale-95 flex items-center justify-center gap-2 ${!isBookable ? 'bg-gray-600 cursor-not-allowed opacity-70 shadow-none' : 'bg-primary hover:bg-primary-hover text-black'}`}
                            >
                                {buttonText}
                            </button>

                            <p className="text-center text-xs text-gray-500 mt-4">
                                By booking, you agree to our Terms & Conditions.
                            </p>
                        </div>

                        {/* Organizer Info Cards */}
                        <div className="order-3 lg:order-none w-full space-y-6 md:mt-6">
                            <OrganizerProfile organizer={event.organizer} />
                            <OrganizerContact organizer={event.organizer} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Ad Section */}


            <ShareModal
                isOpen={isShareModalOpen}
                onClose={() => setIsShareModalOpen(false)}
                url={typeof window !== 'undefined' ? window.location.href : ''}
                title={event.title}
            />

            {/* Mobile Fixed Bottom Booking Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-xl border-t border-white/10 p-4 z-50 lg:hidden flex items-center justify-between gap-4 pb-8">
                <div>
                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-0.5">Starting from</p>
                    <div className="text-xl font-bold text-primary">{event.price}</div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsShareModalOpen(true)}
                        className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                    >
                        <Share2 size={20} />
                    </button>
                    <button
                        onClick={() => isBookable && onBook(event)}
                        disabled={!isBookable}
                        className={`px-8 h-12 font-bold rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center ${!isBookable ? 'bg-gray-600 cursor-not-allowed opacity-70' : 'bg-primary text-black'}`}
                    >
                        {buttonText}
                    </button>
                </div>
            </div>
        </div >
    );
};
