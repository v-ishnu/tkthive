'use client';
import React from 'react';
import { ShieldCheck, Zap, Heart, Star, Users, Lock } from 'lucide-react';
import Link from 'next/link';

export default function WhyUsPage() {
    const features = [
        {
            icon: <ShieldCheck size={32} className="text-primary" />,
            title: "100% Secure Payments",
            desc: "Your transactions are protected by bank-level SSL encryption and industry-leading fraud detection systems."
        },
        {
            icon: <Zap size={32} className="text-primary" />,
            title: "Instant Ticket Delivery",
            desc: "No waiting. Get your verified tickets delivered directly to your email and dashboard seconds after booking."
        },
        {
            icon: <Heart size={32} className="text-primary" />,
            title: "Curated Experiences",
            desc: "We hand-pick the best events in town. From underground gigs to massive festivals, quality is guaranteed."
        },
        {
            icon: <Users size={32} className="text-primary" />,
            title: "Community First",
            desc: "Join 50,000+ happy event-goers. Read real reviews, see attendee counts, and connect with like-minded fans."
        }
    ];

    return (
        <div className="min-h-screen bg-dark text-white pt-24 pb-12 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-primary/5 blur-[100px] -z-10" />

            <div className="container mx-auto px-4 relative z-10 w-full">

                {/* Header */}
                <div className="text-center mb-20 max-w-4xl mx-auto">
                    <span className="text-primary font-bold tracking-widest uppercase text-sm mb-4 block">The TktHive Promise</span>
                    <h1 className="text-4xl md:text-7xl font-black mb-6 leading-tight">
                        Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-amber-200">TktHive?</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        We're not just a ticketing platform. We're your gateway to the moments that matter.
                    </p>
                </div>

                {/* Main Feature Grid */}
                <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto mb-20">
                    {features.map((feature, idx) => (
                        <div key={idx} className="bg-card hover:bg-white/5 border border-white/5 hover:border-primary/30 p-8 rounded-3xl transition-all duration-300 group">
                            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-white/5">
                                {feature.icon}
                            </div>
                            <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                            <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Stats / Trust Section */}
                <div className="border-y border-white/5 py-16 bg-white/[0.02]">
                    <div className="flex flex-col md:flex-row justify-center items-center gap-12 md:gap-24 text-center">
                        <div>
                            <div className="text-4xl md:text-5xl font-black text-white mb-2">50K+</div>
                            <div className="text-gray-500 font-medium uppercase tracking-wider text-sm">Tickets Sold</div>
                        </div>
                        <div>
                            <div className="text-4xl md:text-5xl font-black text-white mb-2">4.9/5</div>
                            <div className="text-gray-500 font-medium uppercase tracking-wider text-sm">User Rating</div>
                        </div>
                        <div>
                            <div className="text-4xl md:text-5xl font-black text-white mb-2">24/7</div>
                            <div className="text-gray-500 font-medium uppercase tracking-wider text-sm">Support</div>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="text-center mt-20">
                    <h2 className="text-3xl font-bold mb-8">Ready to experience it yourself?</h2>
                    <Link href="/events" className="px-10 py-4 bg-primary text-black font-bold text-lg rounded-full hover:bg-white transition-all transform hover:scale-105 shadow-[0_0_30px_rgba(251,191,36,0.3)]">
                        Browse Events
                    </Link>
                </div>
            </div>
        </div>
    );
}
