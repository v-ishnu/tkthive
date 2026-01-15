
import React from 'react';
import { Cpu, Gamepad2, Music, Trophy, Palette, LayoutGrid } from 'lucide-react';
import Link from 'next/link';

export const CategoryButtons = () => {
    const categories = [
        {
            id: 'TECH',
            label: 'Tech & Coding',
            icon: Cpu,
            sub: 'Hackathons, AI, Workshops',
            image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
            gradient: "from-blue-600/90 to-purple-600/90"
        },
        {
            id: 'ESPORTS',
            label: 'Esports & Gaming',
            icon: Gamepad2,
            sub: 'Tournaments, LAN, Meetups',
            image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800",
            gradient: "from-violet-600/90 to-fuchsia-600/90"
        },
        {
            id: 'CONCERT',
            label: 'Concerts & Live',
            icon: Music,
            sub: 'Rock, Pop, EDM, Classical',
            image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=800",
            gradient: "from-rose-600/90 to-orange-600/90"
        },
        {
            id: 'SPORTS',
            label: 'Sports & Fitness',
            icon: Trophy,
            sub: 'Cricket, Football, Marathons',
            image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=800",
            gradient: "from-emerald-600/90 to-teal-600/90"
        },
        {
            id: 'ARTS',
            label: 'Arts & Culture',
            icon: Palette,
            sub: 'Exhibitions, Theatre, Comedy',
            image: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?auto=format&fit=crop&q=80&w=800",
            gradient: "from-amber-500/90 to-orange-600/90"
        },
        {
            id: 'All',
            label: 'More Categories',
            icon: LayoutGrid,
            sub: 'Workshops, Seminars, Food',
            image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800",
            gradient: "from-gray-700/90 to-black/90"
        }
    ];

    return (
        <div className="container mx-auto px-4 py-8">
            <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
                Browse by Category <span className="text-primary text-4xl">.</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((cat) => (
                    <Link
                        key={cat.id}
                        href={cat.id === 'All' ? '/events' : `/events?category=${cat.id}`}
                        className="group relative h-40 rounded-[2rem] overflow-hidden border border-white/10 hover:border-primary/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(255,165,0,0.15)] hover:-translate-y-1 block"
                    >
                        {/* Background Image */}
                        <div className="absolute inset-0">
                            <img src={cat.image} alt={cat.label} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        </div>

                        {/* Gradient Overlay */}
                        <div className={`absolute inset-0 bg-gradient-to-r ${cat.gradient} opacity-90 transition-opacity duration-300`} />

                        {/* Content */}
                        <div className="absolute inset-0 p-6 flex items-center justify-between">
                            <div className="flex flex-col h-full justify-center">
                                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                                    <cat.icon size={24} className="text-white" />
                                </div>
                                <h4 className="text-xl font-bold text-white mb-1 group-hover:translate-x-1 transition-transform text-shadow">{cat.label}</h4>
                                <p className="text-white/80 text-sm font-medium">{cat.sub}</p>
                            </div>

                            {/* Arrow Decoration */}
                            <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                                <LayoutGrid size={20} className="text-white" />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};
