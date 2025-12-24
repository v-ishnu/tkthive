import React from 'react';
import { Ticket, Music, Mic, Zap, Star, LayoutGrid, Sparkles } from 'lucide-react';

const CARDS_COLUMN_1 = [
    {
        id: 1,
        name: "VIP Access",
        role: "All Areas Pass",
        type: "TICKET",
        icon: <Ticket className="text-emerald-900" />,
        bg: "bg-emerald-400",
        text: "text-emerald-900",
        subText: "text-emerald-800"
    },
    {
        id: 2,
        name: "Sunburn Goa",
        role: "Music Festival",
        type: "EVENT",
        icon: <Music className="text-pink-900" />,
        bg: "bg-pink-500",
        text: "text-pink-950",
        subText: "text-pink-900"
    },
    {
        id: 3,
        name: "Early Bird",
        role: "50% Off Limited",
        type: "OFFER",
        icon: <Sparkles className="text-amber-900" />,
        bg: "bg-amber-100",
        text: "text-amber-900",
        subText: "text-amber-700"
    },
    {
        id: 4,
        name: "AI Summit",
        role: "Tech Workshop",
        type: "WORKSHOP",
        icon: <Zap className="text-blue-900" />,
        bg: "bg-blue-400",
        text: "text-blue-950",
        subText: "text-blue-900"
    }
];

const CARDS_COLUMN_2 = [
    {
        id: 5,
        name: "Comedy Night",
        role: "Stand-up Special",
        type: "LIVE SHOW",
        icon: <Mic className="text-emerald-900" />,
        bg: "bg-emerald-300",
        text: "text-emerald-950",
        subText: "text-emerald-800"
    },
    {
        id: 6,
        name: "Backstage",
        role: "Artist Meet & Greet",
        type: "EXPERIENCE",
        icon: <Star className="text-zinc-900" />,
        bg: "bg-white",
        text: "text-zinc-900",
        subText: "text-zinc-500"
    },
    {
        id: 7,
        name: "Hackathon",
        role: "48h Coding Sprint",
        type: "COMPETITION",
        icon: <LayoutGrid className="text-purple-900" />,
        bg: "bg-purple-400",
        text: "text-purple-950",
        subText: "text-purple-900"
    },
    {
        id: 8,
        name: "Food Fest",
        role: "Gourmet Experience",
        type: "FESTIVAL",
        icon: <Ticket className="text-orange-900" />,
        bg: "bg-orange-400",
        text: "text-orange-950",
        subText: "text-orange-800"
    }
];

// Duplicate for seamless loop
const COL_1_DOUBLED = [...CARDS_COLUMN_1, ...CARDS_COLUMN_1, ...CARDS_COLUMN_1];
const COL_2_DOUBLED = [...CARDS_COLUMN_2, ...CARDS_COLUMN_2, ...CARDS_COLUMN_2];

export function HeroCards() {
    return (
        <div className="relative h-[400px] md:h-[600px] w-full max-w-[500px] overflow-hidden mask-gradient-y flex gap-3 md:gap-6 justify-center">

            {/* Gradient Masks (Top/Bottom fade) */}
            <div className="absolute top-0 left-0 w-full h-20 md:h-32 bg-gradient-to-b from-zinc-950 to-transparent z-10 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-full h-20 md:h-32 bg-gradient-to-t from-zinc-950 to-transparent z-10 pointer-events-none" />

            {/* Column 1 (Scrolls UP) */}
            <div className="flex flex-col gap-3 md:gap-6 w-1/2 md:w-56 animate-vertical-marquee">
                {COL_1_DOUBLED.map((card, idx) => (
                    <div
                        key={`${card.id}-${idx}`}
                        className={`${card.bg} p-4 md:p-6 rounded-2xl md:rounded-3xl flex flex-col justify-between h-48 md:h-64 shrink-0 shadow-lg hover:scale-105 transition-transform duration-300`}
                    >
                        <div className="flex justify-between items-start">
                            <div className={`p-1.5 md:p-2 rounded-full bg-white/20 backdrop-blur-sm w-fit`}>
                                {card.icon}
                            </div>
                        </div>

                        <div className="mt-auto">
                            <p className={`text-[10px] md:text-xs font-bold uppercase tracking-wider mb-1 md:mb-2 ${card.subText} opacity-80`}>
                                {card.type}
                            </p>
                            <h3 className={`text-base md:text-xl font-bold leading-tight ${card.text}`}>
                                {card.name}
                            </h3>
                            <p className={`text-[10px] md:text-sm font-medium mt-0.5 md:mt-1 ${card.subText}`}>
                                {card.role}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Column 2 (Scrolls DOWN) */}
            <div className="flex flex-col gap-3 md:gap-6 w-1/2 md:w-56 animate-vertical-marquee-reverse translate-y-[-50%]">
                {COL_2_DOUBLED.map((card, idx) => (
                    <div
                        key={`${card.id}-${idx}`}
                        className={`${card.bg} p-4 md:p-6 rounded-2xl md:rounded-3xl flex flex-col justify-between h-48 md:h-64 shrink-0 shadow-lg hover:scale-105 transition-transform duration-300`}
                    >
                        <div className="flex justify-between items-start">
                            <div className={`p-1.5 md:p-2 rounded-full bg-white/20 backdrop-blur-sm w-fit`}>
                                {card.icon}
                            </div>
                        </div>

                        <div className="mt-auto">
                            <p className={`text-[10px] md:text-xs font-bold uppercase tracking-wider mb-1 md:mb-2 ${card.subText} opacity-80`}>
                                {card.type}
                            </p>
                            <h3 className={`text-base md:text-xl font-bold leading-tight ${card.text}`}>
                                {card.name}
                            </h3>
                            <p className={`text-[10px] md:text-sm font-medium mt-0.5 md:mt-1 ${card.subText}`}>
                                {card.role}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
}
