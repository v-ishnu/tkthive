import React from 'react';
import { Award, Zap, Shield, Globe, Hexagon } from 'lucide-react';

const sponsors = [
    { name: "LiveNation", icon: <Globe size={32} /> },
    { name: "BookMyShow", icon: <TicketIcon size={32} /> },
    { name: "Insider", icon: <Zap size={32} /> },
    { name: "Paytm", icon: <Shield size={32} /> },
    { name: "Spotify", icon: <Hexagon size={32} /> },
];

function TicketIcon({ size }: { size: number }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
            <path d="M13 5v2" />
            <path d="M13 17v2" />
            <path d="M13 11v2" />
        </svg>
    )
}

export const SponsorsSection = () => {
    return (
        <section className="mx-auto container py-20 border-t border-white/5">
            <div className="container mx-auto px-4 text-center">
                <p className="text-gray-500 uppercase tracking-widest text-xs font-bold mb-10">Trusted by Global Event Partners</p>
                <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                    {sponsors.map((sponsor, idx) => (
                        <div key={idx} className="flex flex-col items-center gap-3 group">
                            <div className="p-4 bg-white/5 rounded-2xl group-hover:bg-primary/20 group-hover:text-primary transition-all duration-300">
                                {sponsor.icon}
                            </div>
                            <span className="text-sm font-semibold hidden md:block group-hover:text-white transition-colors">{sponsor.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
