import React from 'react';
import Link from 'next/link';
import { Cpu, Gamepad2, Trophy, Palette, PartyPopper, Music, MoreHorizontal, Calendar } from 'lucide-react';

const tech = "/vector/tech.png"
const esports = "/vector/esports.png"
const sports = "/vector/sports.png"
// const art = "/vector/art.png"
const festival = "/vector/fest.png"
const concert = "/vector/concerts.png"
// const others = "/vector/others.png"
// const all = "/vector/all.png"

const CARDS_COLUMN_1 = [
    {
        id: 'Tech',
        name: "Tech & Coding",
        role: "Hackathons & Summits",
        type: "CATEGORY",
        icon: <Cpu className="text-blue-900" />,
        bg: "bg-blue-400",
        text: "text-blue-950",
        subText: "text-blue-900",
        image: tech
    },
    {
        id: 'Esports',
        name: "Esports",
        role: "Tournaments & LANs",
        type: "CATEGORY",
        icon: <Gamepad2 className="text-purple-900" />,
        bg: "bg-purple-400",
        text: "text-purple-950",
        subText: "text-purple-900",
        image: esports
    },
    {
        id: 'Sports',
        name: "Sports",
        role: "Matches & Marathons",
        type: "CATEGORY",
        icon: <Trophy className="text-orange-900" />,
        bg: "bg-orange-400",
        text: "text-orange-950",
        subText: "text-orange-900",
        image: sports
    },
    {
        id: 'Art',
        name: "Arts & Culture",
        role: "Exhibitions & Theatre",
        type: "CATEGORY",
        icon: <Palette className="text-pink-900" />,
        bg: "bg-pink-400",
        text: "text-pink-950",
        subText: "text-pink-900",
        // image: art
    }
];

const CARDS_COLUMN_2 = [
    {
        id: 'Festival',
        name: "Festivals",
        role: "Music & Food",
        type: "CATEGORY",
        icon: <PartyPopper className="text-yellow-900" />,
        bg: "bg-yellow-400",
        text: "text-yellow-950",
        subText: "text-yellow-900",
        image: festival
    },
    {
        id: 'Concert',
        name: "Concerts",
        role: "Live Gigs & DJs",
        type: "CATEGORY",
        icon: <Music className="text-green-900" />,
        bg: "bg-green-400",
        text: "text-green-950",
        subText: "text-green-900",
        image: concert
    },
    {
        id: 'Others',
        name: "Others",
        role: "Networking & More",
        type: "CATEGORY",
        icon: <MoreHorizontal className="text-zinc-900" />,
        bg: "bg-zinc-200",
        text: "text-zinc-950",
        subText: "text-zinc-700",
        // image: others
    },
    {
        id: 'All',
        name: "All Events",
        role: "Explore Everything",
        type: "DISCOVER",
        icon: <Calendar className="text-amber-900" />,
        bg: "bg-primary",
        text: "text-amber-950",
        subText: "text-amber-900",
        // image: all
    }
];

// Duplicate for seamless loop
// Duplicate for seamless loop (2 sets for -50% animation)
const COL_1_DOUBLED = [...CARDS_COLUMN_1];
const COL_2_DOUBLED = [...CARDS_COLUMN_2];

export function HeroCards() {
    return (
        <div className="relative h-[400px] md:h-[600px] w-full max-w-[500px] overflow-hidden mask-gradient-y flex gap-3 md:gap-6 justify-center">

            {/* Gradient Masks (Top/Bottom fade) */}
            <div className="absolute top-0 left-0 w-full h-20 md:h-32 bg-gradient-to-b from-zinc-950 via-zinc-950/80 to-transparent z-10 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-full h-20 md:h-32 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent z-10 pointer-events-none" />

            {/* Column 1 (Scrolls UP) */}
            <div className="flex flex-col w-1/2 md:w-56 animate-vertical-marquee">
                {COL_1_DOUBLED.map((card, idx) => (
                    <Link
                        key={`${card.id}-${idx}`}
                        href={`/events?category=${card.id.toUpperCase()}`}
                        className="block mb-3 md:mb-6"
                    >
                        <div
                            className={`${card.bg} relative overflow-hidden p-4 md:p-6 rounded-2xl md:rounded-3xl flex flex-col justify-between h-48 md:h-64 shrink-0 shadow-lg hover:scale-105 transition-transform duration-300 border border-white/10 h-full`}
                        >
                            {/* Background Image Blend */}
                            {card.image && (
                                <img
                                    src={card.image}
                                    alt=""
                                    className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay pointer-events-none"
                                />
                            )}

                            <div className="flex justify-between items-start relative z-10">
                                <div className={`p-1.5 md:p-2 rounded-full bg-white/20 backdrop-blur-sm w-fit`}>
                                    {card.icon}
                                </div>
                            </div>

                            <div className="mt-auto relative z-10">
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
                    </Link>
                ))}
            </div>

            {/* Column 2 (Scrolls DOWN) */}
            <div className="flex flex-col w-1/2 md:w-56 animate-vertical-marquee-reverse translate-y-[-50%]">
                {COL_2_DOUBLED.map((card, idx) => (
                    <Link
                        key={`${card.id}-${idx}`}
                        href={`/events?category=${card.id.toUpperCase()}`}
                        className="block mb-3 md:mb-6"
                    >
                        <div
                            className={`${card.bg} relative overflow-hidden p-4 md:p-6 rounded-2xl md:rounded-3xl flex flex-col justify-between h-48 md:h-64 shrink-0 shadow-lg hover:scale-105 transition-transform duration-300 border border-white/10 h-full`}
                        >
                            {/* Background Image Blend */}
                            {card.image && (
                                <img
                                    src={card.image}
                                    alt=""
                                    className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay pointer-events-none"
                                />
                            )}

                            <div className="flex justify-between items-start relative z-10">
                                <div className={`p-1.5 md:p-2 rounded-full bg-white/20 backdrop-blur-sm w-fit`}>
                                    {card.icon}
                                </div>
                            </div>

                            <div className="mt-auto relative z-10">
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
                    </Link>
                ))}
            </div>

        </div>
    );
}