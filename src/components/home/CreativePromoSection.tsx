import React from 'react';
import { ArrowRight, Sparkles, Gem, Ticket } from 'lucide-react';

export const CreativePromoSection = () => {
    return (
        <section className="py-24 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900/10 to-blue-900/10 z-0 pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                    {/* Left: Text Content */}
                    <div className="space-y-8">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/20 text-primary rounded-full text-xs font-bold uppercase mb-4">
                                <Sparkles size={14} />
                                Premium Experience
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                                More Than Just a <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">Ticket.</span>
                            </h2>
                            <p className="text-gray-400 text-lg mt-4 max-w-md">
                                Unlock exclusive backstage passes, meet & greets, and early bird access. The Hive Experience is designed for true fans.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-primary/50 transition-colors">
                                <Gem className="text-purple-400 mb-3" size={28} />
                                <h3 className="text-white font-bold mb-1">VIP Access</h3>
                                <p className="text-gray-500 text-sm">Skip lines and get premium seating.</p>
                            </div>
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-primary/50 transition-colors">
                                <Ticket className="text-blue-400 mb-3" size={28} />
                                <h3 className="text-white font-bold mb-1">Group Booking</h3>
                                <p className="text-gray-500 text-sm">Best rates for squads of 5+.</p>
                            </div>
                        </div>

                        <button className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors flex items-center gap-2 group">
                            Explore Premium
                            <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
                        </button>
                    </div>

                    {/* Right: Creative Visual */}
                    <div className="relative h-[400px] w-full flex items-center justify-center perspective-1000">
                        {/* Abstract Floating Cards */}
                        <div className="absolute w-64 h-80 bg-gradient-to-br from-gray-800 to-black rounded-2xl border border-white/10 shadow-2xl transform rotate-[-6deg] hover:rotate-0 transition-all duration-500 z-10 flex flex-col p-6">
                            <div className="flex-1">
                                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                                    <Sparkles className="text-primary" />
                                </div>
                                <div className="h-2 w-20 bg-white/20 rounded mb-2"></div>
                                <div className="h-2 w-32 bg-white/10 rounded"></div>
                            </div>
                            <div className="mt-auto">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <div className="text-xs text-gray-500">Price</div>
                                        <div className="text-xl font-bold text-white">₹2,499</div>
                                    </div>
                                    <div className="px-3 py-1 bg-white text-black text-xs font-bold rounded-full">BUY</div>
                                </div>
                            </div>
                        </div>

                        <div className="absolute top-10 right-10 w-64 h-80 bg-gradient-to-br from-primary/80 to-purple-600/80 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl transform rotate-[6deg] translate-x-4 hover:translate-x-0 hover:rotate-0 transition-all duration-500 z-20 flex flex-col p-6">
                            <div className="text-white font-bold text-2xl mb-2">GOLD PASS</div>
                            <div className="text-white/80 text-sm mb-6">Unlimited access + Food & Bev</div>

                            <div className="mt-auto bg-black/20 p-4 rounded-xl backdrop-blur-sm">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-white/20"></div>
                                    <div className="text-xs text-white/90">
                                        <div>Jane Doe</div>
                                        <div className="opacity-70">Just purchased</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Background blobs */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary/20 rounded-full blur-[100px] -z-10"></div>
                    </div>

                </div>
            </div>
        </section>
    );
};
