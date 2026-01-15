
import React, { useState } from 'react';
import { EventData, EventTab } from '../../types';
import EventSchedule from './EventSchedule';
import EventDocs from './EventDocs';
import EventSubmissions from './EventSubmissions';
import { LayoutList, FileText, Send, Map, Play, Trophy, Mic2, AlertCircle, Info, ChevronLeft, ChevronRight, Megaphone, Globe } from 'lucide-react';

interface EventTabsProps {
    event: EventData;
}

export const EventTabs: React.FC<EventTabsProps> = ({ event }) => {
    // Default to 'details' (Overview) plus any backend tabs sorted by order
    // We can assume 'ABOUT' maps to 'details' or use a separate Overview tab.
    // Let's keep 'Overview' and 'Location' as fixed tabs, and insert dynamic tabs in between.

    // Filter dynamic tabs
    const dynamicTabs = (event.tabs || []).filter(t => t.isActive).sort((a, b) => a.order - b.order);

    const [activeTabKey, setActiveTabKey] = useState<string>('overview');

    const renderTabContent = () => {
        switch (activeTabKey) {
            case 'overview':
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">


                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">About This Event</h2>
                            <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-line">
                                {event.description}
                            </p>



                            {/* Dynamic About content if any */}
                            {dynamicTabs.find(t => t.key === 'ABOUT')?.data?.content && (
                                <div className="mt-6 text-gray-400">
                                    {/* Simple render, ideally use a rich text renderer */}
                                    {dynamicTabs.find(t => t.key === 'ABOUT')?.data?.content}
                                </div>
                            )}
                        </section>

                        {event.accessType === 'private' && (
                            <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-start gap-3">
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

                        {event.addOns && event.addOns.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-bold text-white mb-6">Available Add-ons</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {event.addOns.map(addon => (
                                        <div key={addon.id} className="bg-white/5 p-4 rounded-xl border border-white/10 flex gap-4">
                                            {addon.imageUrl && <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0"><img src={addon.imageUrl} alt={addon.name} className="w-full h-full object-cover" /></div>}
                                            <div>
                                                <h4 className="font-bold text-white">{addon.name}</h4>
                                                <p className="text-primary font-bold text-sm">{addon.price}</p>
                                                <p className="text-gray-400 text-sm mt-1">{addon.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                );

            case 'location':
                if (event.isOnline) {
                    return (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border border-white/10 rounded-2xl p-8 text-center">
                                <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Globe size={40} className="text-primary" />
                                </div>
                                <h2 className="text-3xl font-bold text-white mb-4">Online Event</h2>
                                <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-8">
                                    This event is held online. You will receive the joining link via email after registration or it will be available here when the event starts.
                                </p>
                                {event.liveStreamUrl && (
                                    <a
                                        href={event.liveStreamUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-black font-bold rounded-xl hover:bg-primary/90 transition-colors"
                                    >
                                        <Play size={20} />
                                        Join Event Now
                                    </a>
                                )}
                            </div>
                        </div>
                    );
                }
                return (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-card border border-white/10 rounded-2xl overflow-hidden p-1">
                            <div className="relative w-full h-[400px] bg-white/5 rounded-xl overflow-hidden">
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src={`https://maps.google.com/maps?q=${encodeURIComponent(event.venue.name + ', ' + event.venue.city)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                                    style={{ filter: 'grayscale(1) invert(1) contrast(0.8)' }}
                                    frameBorder="0"
                                    scrolling="no"
                                />
                            </div>
                        </div>
                        <div className="mt-6 flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/10 flex-col md:flex-row gap-4 text-center md:text-left">
                            <div className="flex items-center gap-3 flex-col md:flex-row">
                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                                    <Map className="text-primary" size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">{event.venue.name}</h3>
                                    <p className="text-sm text-gray-400">Get directions and plan your trip</p>
                                </div>
                            </div>
                            <a
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.venue.name + ', ' + event.venue.city)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-6 py-2 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors w-full md:w-auto"
                            >
                                Open in Maps
                            </a>
                        </div>
                    </div>
                );

            // Dynamic Tabs Handling
            default:
                const currentTab = dynamicTabs.find(t => t.key === activeTabKey);
                if (!currentTab) return null;

                // Render based on key or schema type
                if (currentTab.key === 'SCHEDULE' || currentTab.schema?.type === 'timeline') {
                    // Normalize data structure if needed
                    const subEvents = Array.isArray(currentTab.data) ? currentTab.data : [];
                    return <EventSchedule subEvents={subEvents} />;
                }

                if (currentTab.key === 'DOCUMENTS' || currentTab.schema?.type === 'document_list') {
                    const docs = Array.isArray(currentTab.data) ? currentTab.data : [];
                    return <EventDocs docs={docs} />;
                }

                if (currentTab.key === 'SUBMISSIONS' || currentTab.schema?.type === 'submission_list') {
                    // Submissions might need backend fetching, but using passed data for now if available
                    return <EventSubmissions initialSubmissions={event.submissions || []} />;
                }

                if (currentTab.key === 'SPONSORS' || currentTab.schema?.type === 'sponsor_grid') {
                    const sponsors = Array.isArray(currentTab.data) ? currentTab.data : [];
                    return (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {sponsors.map((sponsor: any, idx: number) => (
                                <div key={idx} className="bg-white p-6 rounded-2xl flex flex-col items-center justify-center gap-4 hover:scale-105 transition-transform">
                                    {sponsor.tkthiveUrl ? <img src={sponsor.tkthiveUrl} alt={sponsor.name} className="h-16 object-contain" /> : <div className="text-black font-bold text-xl">{sponsor.name}</div>}
                                    <div className="px-2 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold uppercase rounded">{sponsor.tier || 'Partner'}</div>
                                </div>
                            ))}
                        </div>
                    );
                }

                if (currentTab.key === 'CUSTOM' || currentTab.key === 'PRIZES' || currentTab.schema?.type === 'prize_list') {
                    const prizes = Array.isArray(currentTab.data) ? currentTab.data : [];
                    return (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {prizes.map((prize: any, idx: number) => (
                                <div key={idx} className="bg-linear-to-br from-card to-white/5 border border-white/10 p-6 rounded-2xl flex items-center gap-6">
                                    <div className={`w-16 h-16 rounded-full flex items-center justify-center shrink-0 ${idx === 0 ? 'bg-yellow-500 text-black' : idx === 1 ? 'bg-gray-400 text-black' : 'bg-orange-700 text-white'}`}>
                                        <Trophy size={32} />
                                    </div>
                                    <div>
                                        <div className="text-primary font-bold tracking-widest uppercase text-sm mb-1">{prize.title || prize.place}</div>
                                        <div className="text-3xl font-bold text-white mb-1">{prize.reward || prize.amount}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                }

                // Fallback for unknown text content
                return (
                    <div className="text-gray-300">
                        <pre className="whitespace-pre-wrap font-sans">
                            {JSON.stringify(currentTab.data, null, 2)}
                        </pre>
                    </div>
                );
        }
    };

    return (
        <div>
            {/* Tabs Navigation */}
            <div className="sticky top-20 z-30 bg-dark/95 backdrop-blur-xl mb-8 border-b border-white/10 -mx-4 px-4 md:mx-0 md:px-0">
                <div className="relative flex items-center">
                    {/* Left Scroll Button */}
                    <button
                        onClick={() => {
                            const container = document.getElementById('tabs-container');
                            if (container) container.scrollBy({ left: -200, behavior: 'smooth' });
                        }}
                        className="absolute left-0 z-10 p-2 bg-dark/80 backdrop-blur-sm border-r border-white/10 text-white hover:text-primary hidden md:block" // Hidden on mobile, shown on desktop if needed
                    >
                        <ChevronLeft size={20} />
                    </button>

                    <div
                        id="tabs-container"
                        className="flex gap-4 overflow-x-auto py-3 scrollbar-hide px-8 md:px-8 w-full"
                    >
                        <button
                            onClick={() => setActiveTabKey('overview')}
                            className={`px-4 py-2 text-sm font-bold uppercase tracking-wide transition-colors whitespace-nowrap border-b-2 flex items-center gap-2 ${activeTabKey === 'overview' ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-white'}`}
                        >
                            <Info size={14} /> Overview
                        </button>

                        {/* Location / Online Tab - Always 2nd */}
                        <button
                            onClick={() => setActiveTabKey('location')}
                            className={`px-4 py-2 text-sm font-bold uppercase tracking-wide transition-colors whitespace-nowrap border-b-2 flex items-center gap-2 ${activeTabKey === 'location' ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-white'}`}
                        >
                            {event.isOnline ? <Globe size={14} /> : <Map size={14} />}
                            {event.isOnline ? 'Online Event' : 'Location'}
                        </button>

                        {dynamicTabs.map(tab => {
                            if (tab.key === 'ABOUT') return null;

                            let Icon = FileText;
                            if (tab.key === 'SCHEDULE') Icon = LayoutList;
                            if (tab.key === 'SUBMISSIONS') Icon = Send;
                            if (tab.key === 'LOCATION') Icon = Map;
                            if (tab.key === 'LIVE') Icon = Play;
                            if (tab.key === 'PRIZES' || tab.key === 'CUSTOM') Icon = Trophy;
                            if (tab.key === 'GUESTS') Icon = Mic2;

                            return (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTabKey(tab.key)}
                                    className={`px-4 py-2 text-sm font-bold uppercase tracking-wide transition-colors whitespace-nowrap border-b-2 flex items-center gap-2 ${activeTabKey === tab.key ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-white'}`}
                                >
                                    <Icon size={14} /> {tab.title}
                                </button>
                            );
                        })}
                    </div>

                    {/* Right Scroll Button */}
                    <button
                        onClick={() => {
                            const container = document.getElementById('tabs-container');
                            if (container) container.scrollBy({ left: 200, behavior: 'smooth' });
                        }}
                        className="absolute right-0 z-10 p-2 bg-dark/80 backdrop-blur-sm border-l border-white/10 text-white hover:text-primary hidden md:block"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
                {renderTabContent()}
            </div>
        </div>
    );
};
