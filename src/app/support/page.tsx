'use client'
import React, { useState } from 'react';
import { Mail, Phone, MapPin, MessageSquare, Send, HelpCircle, FileText, Briefcase } from 'lucide-react';


export default function ContactSupportPage() {
    const [formState, setFormState] = useState({ name: '', email: '', subject: '', message: '' });
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitted(true);
        // Reset after delay for demo
        setTimeout(() => {
            setIsSubmitted(false);
            setFormState({ name: '', email: '', subject: '', message: '' });
        }, 3000);
    };

    const supportCards = [
        {
            icon: <HelpCircle size={32} />,
            title: "Customer Support",
            desc: "Need help with your ticket? We are here 24/7.",
            action: "Chat Now",
            color: "text-primary"
        },
        {
            icon: <Briefcase size={32} />,
            title: "Organizer Support",
            desc: "Hosting an event? Get dedicated assistance.",
            action: "Contact Sales",
            color: "text-blue-400"
        },
        {
            icon: <FileText size={32} />,
            title: "Media & Press",
            desc: "For press inquiries and brand assets.",
            action: "Email Us",
            color: "text-purple-400"
        }
    ];

    return (
        <div className="min-h-screen bg-dark text-white pt-24 pb-12 relative overflow-hidden">


            <div className="container mx-auto px-4 relative z-10">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-primary font-bold tracking-widest uppercase text-sm mb-4 block">Here to Help</span>
                    <h1 className="text-5xl md:text-7xl font-bold mb-6">Contact & Support</h1>
                    <p className="text-xl text-gray-400">
                        Have a question? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                    </p>
                </div>

                {/* Support Channels Grid */}
                <div className="grid md:grid-cols-3 gap-6 mb-20">
                    {supportCards.map((card, idx) => (
                        <div key={idx} className="bg-card border border-white/10 p-8 rounded-3xl hover:border-primary/50 transition-all group">
                            <div className={`w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6 ${card.color} group-hover:scale-110 transition-transform`}>
                                {card.icon}
                            </div>
                            <h3 className="text-2xl font-bold mb-2">{card.title}</h3>
                            <p className="text-gray-400 mb-6">{card.desc}</p>
                            <button className={`font-bold uppercase tracking-wider text-sm flex items-center gap-2 ${card.color} hover:underline`}>
                                {card.action} <MessageSquare size={16} />
                            </button>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col lg:flex-row gap-12 items-start">

                    {/* Contact Form */}
                    <div className="w-full lg:w-2/3 bg-card border border-white/10 rounded-3xl p-8 md:p-12 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[50px] rounded-full pointer-events-none" />

                        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                            <Mail className="text-primary" /> Send us a Message
                        </h2>

                        {isSubmitted ? (
                            <div className="h-[400px] flex flex-col items-center justify-center text-center animate-in fade-in zoom-in">
                                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6">
                                    <Send className="text-black" size={32} />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                                <p className="text-gray-400">We'll get back to you within 24 hours.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-500 uppercase">Your Name</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 focus:border-primary/50 outline-none text-white transition-colors"
                                            placeholder="John Doe"
                                            value={formState.name}
                                            onChange={e => setFormState({ ...formState, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-500 uppercase">Email Address</label>
                                        <input
                                            type="email"
                                            required
                                            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 focus:border-primary/50 outline-none text-white transition-colors"
                                            placeholder="john@example.com"
                                            value={formState.email}
                                            onChange={e => setFormState({ ...formState, email: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-500 uppercase">Subject</label>
                                    <select
                                        className="w-full bg-black/40 border border-white/10 rounded-xl p-4 focus:border-primary/50 outline-none text-white transition-colors appearance-none"
                                        value={formState.subject}
                                        onChange={e => setFormState({ ...formState, subject: e.target.value })}
                                    >
                                        <option value="" disabled>Select a topic</option>
                                        <option value="ticket">Ticket Issue</option>
                                        <option value="refund">Refund Request</option>
                                        <option value="tech">Technical Support</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-500 uppercase">Message</label>
                                    <textarea
                                        required
                                        rows={5}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl p-4 focus:border-primary/50 outline-none text-white transition-colors resize-none"
                                        placeholder="How can we help you?"
                                        value={formState.message}
                                        onChange={e => setFormState({ ...formState, message: e.target.value })}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-primary hover:bg-primary-hover text-black font-bold py-4 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                                >
                                    Send Message <Send size={18} />
                                </button>
                            </form>
                        )}
                    </div>

                    {/* Info Sidebar */}
                    <div className="w-full lg:w-1/3 space-y-6">
                        <div className="bg-card border border-white/10 p-8 rounded-3xl">
                            <h3 className="text-xl font-bold mb-6">Contact Info</h3>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-white/5 rounded-full text-primary">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white">Headquarters</h4>
                                        <p className="text-gray-400 text-sm mt-1">
                                            123 Hive Tower, Tech Park,<br />
                                            Mumbai, Maharashtra 400001
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-white/5 rounded-full text-primary">
                                        <Phone size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white">Phone</h4>
                                        <p className="text-gray-400 text-sm mt-1">
                                            +91 1800 123 4567<br />
                                            <span className="text-xs text-gray-500">Mon-Fri, 9am - 6pm</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-white/5 rounded-full text-primary">
                                        <Mail size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white">Email</h4>
                                        <p className="text-gray-400 text-sm mt-1">
                                            support@LOGO.com<br />
                                            partners@LOGO.com
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-primary/20 to-transparent border border-primary/20 p-8 rounded-3xl">
                            <h3 className="text-xl font-bold mb-2">FAQ</h3>
                            <p className="text-gray-400 text-sm mb-4">Find answers quickly in our help center.</p>
                            <button className="text-primary font-bold hover:underline">Visit Help Center &rarr;</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
