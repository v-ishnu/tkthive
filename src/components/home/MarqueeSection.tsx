import React from 'react';
import { Sparkles, Zap, Ticket, Trophy, AlertCircle } from 'lucide-react';

const ITEMS = [
    { text: "BOOK YOUR TICKETS NOW", icon: <Ticket size={16} /> },
    { text: "EXCLUSIVE EVENTS & EXPERIENCES", icon: <Sparkles size={16} /> },
    { text: "LIVE PERFORMANCES NEAR YOU", icon: <Zap size={16} /> },
    { text: "JOIN THE EXPERIENCES", icon: <Trophy size={16} /> },
];

// Duplicate items enough times to ensure smooth scrolling without gaps
const MARQUEE_ITEMS = [...ITEMS, ...ITEMS, ...ITEMS, ...ITEMS];

const MarqueeSection = () => {
    return (
        <div className="relative flex overflow-x-hidden bg-black text-white py-4 border-y border-black/10 select-none group">
            {/* Gradient Overlays for smooth fade effect at edges */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-secondary to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-secondary to-transparent z-10 pointer-events-none" />

            {/* Single container animating from 0% to -50% */}
            <div className="flex animate-marquee-infinite">
                {MARQUEE_ITEMS.map((item, i) => (
                    <div key={i} className="flex items-center mx-8 gap-3 font-bold uppercase tracking-wider text-sm md:text-base shrink-0">
                        <span className="text-primary">{item.icon}</span>
                        <span>{item.text}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-white/40 ml-8" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MarqueeSection;
