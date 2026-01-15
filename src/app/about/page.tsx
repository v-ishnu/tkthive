
import React from 'react';
import { Users, Globe, Shield, Zap, Heart, Award } from 'lucide-react';

export default function AboutUsPage() {
    return (
        <div className="min-h-screen bg-dark text-white pt-20">
            {/* Hero Section */}
            <div className="relative overflow-hidden py-24 px-4">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10" />
                <div className="absolute inset-0 bg-gradient-to-b from-dark via-transparent to-dark" />

                <div className="relative container mx-auto text-center max-w-4xl">
                    <span className="text-primary font-bold tracking-widest uppercase text-sm mb-4 block">Our Story</span>
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                        Connecting the World <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-yellow-200">One Event at a Time</span>
                    </h1>
                    <p className="text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto">
                        tkthive is more than a booking platform. We are a community-driven ecosystem designed to bring people together through shared experiences, from underground raves to global tech summits.
                    </p>
                </div>
            </div>

            {/* Stats Section */}
            <div className="container mx-auto px-4 mb-24">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Events Hosted', value: '10K+' },
                        { label: 'Active Users', value: '2M+' },
                        { label: 'Countries', value: '120+' },
                        { label: 'Partner Organizers', value: '500+' },
                    ].map((stat, idx) => (
                        <div key={idx} className="bg-card border border-white/5 p-8 rounded-2xl text-center hover:border-primary/30 transition-colors group">
                            <div className="text-4xl md:text-5xl font-bold text-white mb-2 group-hover:text-primary transition-colors">{stat.value}</div>
                            <div className="text-gray-500 text-sm uppercase tracking-wider">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Mission & Vision */}
            <div className="container mx-auto px-4 mb-24">
                <div className="flex flex-col md:flex-row gap-16 items-center">
                    <div className="md:w-1/2 space-y-8">
                        <div>
                            <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
                                <Zap className="text-primary" /> Our Mission
                            </h2>
                            <p className="text-gray-400 text-lg leading-relaxed">
                                To democratize event organization and discovery. We believe that everyone should have access to life-changing experiences, whether it's learning a new skill, celebrating with friends, or competing at the highest level.
                            </p>
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
                                <Globe className="text-primary" /> Global Vision
                            </h2>
                            <p className="text-gray-400 text-lg leading-relaxed">
                                A world where borders don't limit your ability to connect. Through our hybrid event technology, we bridge the gap between physical and digital presence, making every event accessible to anyone, anywhere.
                            </p>
                        </div>
                    </div>
                    <div className="md:w-1/2 grid grid-cols-2 gap-4">
                        <img src="https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1000&auto=format&fit=crop" className="rounded-2xl border border-white/10 w-full h-64 object-cover transform translate-y-8" alt="Event Crowd" />
                        <img src="https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=1000&auto=format&fit=crop" className="rounded-2xl border border-white/10 w-full h-64 object-cover" alt="Conference" />
                    </div>
                </div>
            </div>

            {/* Core Values */}
            <div className="bg-card border-y border-white/5 py-24">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose tkthive?</h2>
                        <p className="text-gray-400">Built for organizers, loved by attendees.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="p-8 rounded-3xl bg-dark border border-white/5 hover:border-primary/30 transition-all">
                            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                                <Shield className="text-primary" size={28} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Trust & Security</h3>
                            <p className="text-gray-400">
                                We prioritize your safety with bank-grade payment encryption and verified organizer profiles, ensuring every ticket is authentic.
                            </p>
                        </div>
                        <div className="p-8 rounded-3xl bg-dark border border-white/5 hover:border-primary/30 transition-all">
                            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                                <Heart className="text-primary" size={28} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Community First</h3>
                            <p className="text-gray-400">
                                Our platform rewards engagement. Earn points for attending events, leaving reviews, and building your local community.
                            </p>
                        </div>
                        <div className="p-8 rounded-3xl bg-dark border border-white/5 hover:border-primary/30 transition-all">
                            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                                <Award className="text-primary" size={28} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Excellence</h3>
                            <p className="text-gray-400">
                                We curate only the best. Our AI-driven recommendation engine ensures you spend less time searching and more time experiencing.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Team Section */}
            <div className="container mx-auto px-4 py-24">
                <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center">Meet the Creators</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                    {[
                        { name: 'Alex Chen', role: 'CEO & Founder', img: 'https://randomuser.me/api/portraits/men/32.jpg' },
                        { name: 'Sarah Miller', role: 'Head of Product', img: 'https://randomuser.me/api/portraits/women/44.jpg' },
                        { name: 'James Wilson', role: 'Lead Engineer', img: 'https://randomuser.me/api/portraits/men/86.jpg' },
                        { name: 'Maya Patel', role: 'Community Manager', img: 'https://randomuser.me/api/portraits/women/65.jpg' },
                    ].map((member, idx) => (
                        <div key={idx} className="text-center group">
                            <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-2 border-white/10 group-hover:border-primary transition-colors mb-6">
                                <img src={member.img} alt={member.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                            </div>
                            <h3 className="text-lg font-bold text-white">{member.name}</h3>
                            <p className="text-primary text-sm">{member.role}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA */}
            <div className="container mx-auto px-4 pb-24">
                <div className="bg-primary rounded-3xl p-12 text-center relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">Ready to Join the Hive?</h2>
                        <p className="text-black/80 text-lg mb-8 max-w-xl mx-auto">
                            Whether you are an organizer looking to host your next big event or an attendee seeking adventure, tkthive is your home.
                        </p>
                        <div className="flex justify-center gap-4">
                            <button className="px-8 py-3 bg-black text-white font-bold rounded-full hover:bg-gray-800 transition-colors">
                                Create Event
                            </button>
                            <button className="px-8 py-3 bg-white/20 border border-black/10 text-black font-bold rounded-full hover:bg-white/30 transition-colors">
                                Browse Events
                            </button>
                        </div>
                    </div>
                    {/* Decorative pattern */}
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
                </div>
            </div>
        </div>
    );
};
