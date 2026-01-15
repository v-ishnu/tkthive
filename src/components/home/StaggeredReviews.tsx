import { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Quote } from 'lucide-react';

const REVIEWS = [
    {
        id: 1,
        user: { name: "Arjun Mehta", avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&auto=format&fit=crop" },
        text: "It's just the best. Period.",
        event: "Global Smt '26",
        rotation: "rotate-[-2deg]",
    },
    {
        id: 2,
        user: { name: "Sarah Jenkins", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop" },
        text: "Took some convincing, but now that we're on TktHive we're never going back.",
        event: "Sunburn Goa",
        rotation: "rotate-[1deg]",
    },
    {
        id: 3,
        user: { name: "Rahul Verma", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop" },
        text: "I would be lost without the real-time analytics. The ROI is 100X for us.",
        event: "Valo League",
        rotation: "rotate-[-1deg]",
    },
    {
        id: 4,
        user: { name: "Priya Singh", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop" },
        text: "The booking flow is absolutely seamless. My audience loves it.",
        event: "Food Fest",
        rotation: "rotate-[0deg]",
    },
    {
        id: 5,
        user: { name: "David Chen", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop" },
        text: "It's so simple and intuitive we got the team up in 10 minutes.",
        event: "Cosmos Tech",
        rotation: "rotate-[2deg]",
    },
    {
        id: 6,
        user: { name: "Ananya Gupta", avatar: "https://images.unsplash.com/photo-1629425733761-caae3b5f2e50?q=80&w=200&auto=format&fit=crop" },
        text: "Finally a platform that respects the aesthetics of art events.",
        event: "Art Fair",
        rotation: "rotate-[-3deg]",
    }
];

export function StaggeredReviews() {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [activeId, setActiveId] = useState(4); // Default highlighted card

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = 320;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <section className="py-24  relative overflow-hidden">
            <div className="container mx-auto px-4 relative z-10 flex flex-col items-center">

                {/* Heading */}
                <div className="text-center mb-16 max-w-2xl">
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-6 uppercase tracking-tight">
                        Fan <span className="text-primary">Favorites</span>
                    </h2>
                    <p className="text-zinc-400 text-lg">
                        Hear from the community that drives the pulse of our platform.
                    </p>
                </div>

                {/* Carousel Container */}
                <div
                    ref={scrollRef}
                    className="flex items-center gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide py-12 px-4 w-full max-w-[1400px] mask-gradient pb-20"
                >
                    {REVIEWS.map((review) => {
                        const isActive = activeId === review.id;

                        return (
                            <div
                                key={review.id}
                                onClick={() => setActiveId(review.id)}
                                className={`
                                    relative flex-shrink-0 w-[280px] md:w-[320px] aspect-[4/5] p-8 flex flex-col justify-between cursor-pointer
                                    shadow-2xl transition-all duration-500 snap-center
                                    ${isActive
                                        ? 'bg-primary text-black scale-110 z-20 rotate-0 rounded-tr-[40px] rounded-bl-[40px] rounded-tl-md rounded-br-md shadow-lg shadow-primary/20'
                                        : `bg-zinc-900 text-zinc-400 ${review.rotation} hover:rotate-0 z-10 hover:bg-zinc-800 hover:text-zinc-200 hover:scale-105 rounded-sm border border-white/5`
                                    }
                                `}
                            >
                                {/* User Image Top */}
                                <div className="w-16 h-16 mb-4">
                                    <img
                                        src={review.user.avatar}
                                        alt={review.user.name}
                                        className={`w-full h-full object-cover border-4 ${isActive ? 'border-black' : 'border-zinc-800'} shadow-md rounded-full`}
                                    />
                                </div>

                                {/* Quote */}
                                <div className="flex-grow flex flex-col justify-center">
                                    <Quote size={32} className={`mb-4 ${isActive ? 'text-black/20' : 'text-zinc-700'}`} />
                                    <p className={`text-xl md:text-2xl font-bold leading-tight ${isActive ? 'text-black' : 'text-zinc-300'}`}>
                                        "{review.text}"
                                    </p>
                                </div>

                                {/* Footer */}
                                <div className={`mt-6 pt-4 border-t ${isActive ? 'border-black/10' : 'border-white/5'}`}>
                                    <p className={`text-sm font-bold ${isActive ? 'text-black' : 'text-zinc-300'}`}>
                                        - {review.user.name}
                                    </p>
                                    <p className={`text-xs uppercase tracking-wider font-bold mt-1 ${isActive ? 'text-black/60' : 'text-zinc-600'}`}>
                                        @ {review.event}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Navigation Controls */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => scroll('left')}
                        className="p-4 rounded-full bg-zinc-900 text-white hover:bg-primary hover:text-black transition-colors border border-zinc-800"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className="p-4 rounded-full bg-zinc-900 text-white hover:bg-primary hover:text-black transition-colors border border-zinc-800"
                    >
                        <ArrowRight size={24} />
                    </button>
                </div>

            </div>
        </section>
    );
}
