
import React, { useState } from 'react';
import { EventData, EventTab } from '../../types';
import EventSchedule from './EventSchedule';
import EventDocs from './EventDocs';
import EventSubmissions from './EventSubmissions';
import { LayoutList, FileText, Send, Map, Play, Trophy, Mic2, AlertCircle, Info, ChevronLeft, ChevronRight, Megaphone, Globe, MapPin, Calendar } from 'lucide-react';

interface EventTabsProps {
    event: EventData;
}

export const EventTabs: React.FC<EventTabsProps> = ({ event }) => {
    // Default to 'details' (Overview) plus any backend tabs sorted by order
    // We can assume 'ABOUT' maps to 'details' or use a separate Overview tab.
    // Let's keep 'Overview' and 'Location' as fixed tabs, and insert dynamic tabs in between.

    // Filter dynamic tabs and normalize keys to lowercase
    const dynamicTabs = (event.tabs || [])
        .filter(t => t.isActive)
        .sort((a, b) => a.order - b.order)
        .map(t => ({ ...t, key: t.key.toLowerCase() }));

    // Helper to generate unique ID for tabs since 'key' might be duplicated (e.g. CUSTOM)
    const getTabUniqueId = (tab: EventTab, index: number) => {
        return `${tab.key}-${index}`;
    };

    const getTabIcon = (key: string) => {
        switch (key.toLowerCase()) {
            case 'overview': return <Info size={16} />;
            case 'location': return event.isOnline ? <Globe size={16} /> : <MapPin size={16} />;
            case 'schedule': return <Calendar size={16} />;
            case 'prizes': return <Trophy size={16} />;
            case 'documents': return <FileText size={16} />;
            case 'submissions': return <Send size={16} />;
            case 'sponsors': return <Megaphone size={16} />;
            case 'about': return <Info size={16} />;
            default: return <LayoutList size={16} />;
        }
    };

    const [activeTabKey, setActiveTabKey] = useState<string>('overview');

    const renderTabContent = () => {
        switch (activeTabKey) {
            case 'overview':
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">


                        <section>
                            <h2 className="text-xl md:text-2xl font-bold text-white mb-4">About This Event</h2>
                            <div
                                className="text-gray-300 text-sm md:text-lg leading-relaxed whitespace-pre-line"
                                dangerouslySetInnerHTML={{ __html: event.description }}
                            />



                            {/* Dynamic About content if any */}
                            {dynamicTabs.find(t => t.key === 'about')?.data?.content && (
                                <div className="mt-6 text-gray-400">
                                    {/* Simple render, ideally use a rich text renderer */}
                                    {dynamicTabs.find(t => t.key === 'about')?.data?.content}
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
                                <h2 className="text-xl md:text-2xl font-bold text-white mb-6">Available Add-ons</h2>
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
                        <div className="  ">
                            <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border border-white/10 rounded-2xl p-8 text-center">
                                <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Globe size={40} className="text-primary" />
                                </div>
                                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Online Event</h2>
                                <p className="text-gray-300 text-sm md:text-lg max-w-2xl mx-auto mb-8">
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
                    <div className="">
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
                const currentTab = dynamicTabs.find((t, idx) => getTabUniqueId(t, idx) === activeTabKey);
                if (!currentTab) return null;

                const { schema, data } = currentTab;
                const items = data?.items || (Array.isArray(data) ? data : []);

                // 1. Timeline (Event Structure)
                if (currentTab.key === 'schedule' || schema?.type === 'timeline') {
                    return (
                        <div className="space-y-8  ">
                            <div className="relative border-l-2 border-primary/30 ml-3 md:ml-6 space-y-12 py-4">
                                {items.map((item: any, idx: number) => (
                                    <div key={idx} className="relative pl-8 md:pl-12">
                                        {/* Dot */}
                                        <div className="absolute -left-[9px] top-0 w-5 h-5 rounded-full bg-primary border-4 border-dark shadow-[0_0_10px_rgba(251,191,36,0.6)]"></div>

                                        <h3 className="text-lg md:text-xl font-bold text-white mb-4">{item.title}</h3>

                                        {item.details && Array.isArray(item.details) && (
                                            <ul className="space-y-2">
                                                {item.details.map((detail: string, dIdx: number) => (
                                                    <li key={dIdx} className="text-gray-300 flex items-start gap-2 text-sm md:text-base">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-white/40 mt-2 shrink-0"></span>
                                                        <span>{detail}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                }

                // 2. Info List (Participation Details)
                if (schema?.type === 'info_list') {
                    return (
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 ">
                            <ul className="space-y-4">
                                {items.map((item: string, idx: number) => (
                                    <li key={idx} className="flex items-start gap-3">
                                        <Info className="text-primary shrink-0 mt-1" size={20} />
                                        <span className="text-base md:text-lg text-gray-200">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    );
                }

                // 3. Card List (Thematic Tracks)
                if (schema?.type === 'card_list') {
                    return (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
                            {items.map((item: any, idx: number) => (
                                <div key={idx} className="bg-card border border-white/10 p-6 rounded-xl hover:border-primary/50 transition-colors group">
                                    <h4 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors">{item.title}</h4>
                                    <p className="text-gray-400 leading-relaxed">{item.description}</p>
                                </div>
                            ))}
                        </div>
                    );
                }

                // 4. Bullet List (Eligibility, Certifications, Governance, Objectives)
                if (schema?.type === 'bullet_list') {
                    return (
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8  ">
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                {items.map((item: string, idx: number) => (
                                    <li key={idx} className="flex items-start gap-3 text-gray-300">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0"></div>
                                        <span className="text-base md:text-lg">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    );
                }

                // 5. Prize List (Prizes & Recognition)
                if (currentTab.key === 'prizes' || schema?.type === 'prize_list') {
                    return (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4  ">
                            {items.map((prize: any, idx: number) => (
                                <div key={idx} className="bg-linear-to-br from-card to-white/5 border border-white/10 p-6 rounded-2xl flex items-center gap-6">
                                    <div className={`w-16 h-16 rounded-full flex items-center justify-center shrink-0 ${idx === 0 ? 'bg-yellow-500 text-black' : idx === 1 ? 'bg-gray-300 text-black' : 'bg-orange-600 text-white'}`}>
                                        <Trophy size={32} />
                                    </div>
                                    <div>
                                        <div className="text-primary font-bold tracking-widest uppercase text-xs mb-1">{prize.title}</div>
                                        <div className="text-2xl md:text-3xl font-bold text-white leading-tight">{prize.reward}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    );
                }

                // Legacy / Specific Renderers (Documents, Submissons, Sponsors)
                if (currentTab.key === 'documents' || schema?.type === 'document_list') {
                    return <EventDocs docs={items} />;
                }

                if (currentTab.key === 'submissions' || schema?.type === 'submission_list') {
                    return <EventSubmissions tab={currentTab} eventId={event.id} initialSubmissions={event.submissions || []} />;
                }

                if (currentTab.key === 'sponsors' || schema?.type === 'sponsor_grid') {
                    return (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6  duration-500">
                            {items.map((sponsor: any, idx: number) => (
                                <div key={idx} className="bg-white p-6 rounded-2xl flex flex-col items-center justify-center gap-4 hover:scale-105 transition-transform">
                                    {sponsor.tkthiveUrl ? <img src={sponsor.tkthiveUrl} alt={sponsor.name} className="h-16 object-contain" /> : <div className="text-black font-bold text-xl">{sponsor.name}</div>}
                                    <div className="px-2 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold uppercase rounded">{sponsor.tier || 'Partner'}</div>
                                </div>
                            ))}
                        </div>
                    );
                }

                // Fallback
                return (
                    <div className="text-gray-300 bg-white/5 p-4 rounded-xl font-mono text-sm overflow-auto">
                        <pre>{JSON.stringify(data, null, 2)}</pre>
                    </div>
                );
        }
    };

    return (
        <div>
            {/* Tabs Navigation */}
            <div className="sticky top-20 z-30 bg-dark/95 backdrop-blur-xl mb-8 -mx-4 px-4 md:mx-0 md:px-0 py-4">
                <div className="relative flex items-center">
                    {/* Left Scroll Button */}
                    <button
                        onClick={() => {
                            const container = document.getElementById('tabs-container');
                            if (container) container.scrollBy({ left: -200, behavior: 'smooth' });
                        }}
                        className="absolute left-0 z-10 p-3 bg-dark/80 backdrop-blur-xl border border-white/10 text-white hover:text-primary rounded-full shadow-lg hidden md:block -ml-2"
                    >
                        <ChevronLeft size={20} />
                    </button>

                    <div
                        id="tabs-container"
                        className="flex gap-3 overflow-x-auto py-2 scrollbar-hide px-2 md:px-12 w-full snap-x"
                    >
                        <button
                            onClick={() => setActiveTabKey('overview')}
                            className={`px-4 py-2 md:px-6 md:py-2.5 rounded-full text-xs md:text-sm font-bold uppercase tracking-wide transition-all duration-300 border whitespace-nowrap flex items-center gap-2 ${activeTabKey === 'overview'
                                ? 'bg-primary text-black border-primary shadow-lg shadow-primary/25 scale-105'
                                : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20'
                                }`}
                        >
                            {getTabIcon('overview')}
                            Overview
                        </button>

                        <button
                            onClick={() => setActiveTabKey('location')}
                            className={`px-4 py-2 md:px-6 md:py-2.5 rounded-full text-xs md:text-sm font-bold uppercase tracking-wide transition-all duration-300 border whitespace-nowrap flex items-center gap-2 ${activeTabKey === 'location'
                                ? 'bg-primary text-black border-primary shadow-lg shadow-primary/25 scale-105'
                                : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20'
                                }`}
                        >
                            {getTabIcon('location')}
                            {event.isOnline ? 'Online Event' : 'Location'}
                        </button>

                        {dynamicTabs.map((tab, idx) => {
                            if (tab.key === 'about') return null;

                            const uniqueId = getTabUniqueId(tab, idx);

                            return (
                                <button
                                    key={uniqueId}
                                    onClick={() => setActiveTabKey(uniqueId)}
                                    className={`px-4 py-2 md:px-6 md:py-2.5 rounded-full text-xs md:text-sm font-bold uppercase tracking-wide transition-all duration-300 border whitespace-nowrap flex items-center gap-2 ${activeTabKey === uniqueId
                                        ? 'bg-primary text-black border-primary shadow-lg shadow-primary/25 scale-105'
                                        : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20'
                                        }`}
                                >
                                    {getTabIcon(tab.key)}
                                    {tab.title}
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
                        className="absolute right-0 z-10 p-3 bg-dark/80 backdrop-blur-xl border border-white/10 text-white hover:text-primary rounded-full shadow-lg hidden md:block -mr-2"
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
