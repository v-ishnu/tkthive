'use client';
import React from 'react';
import { RefreshCcw, DollarSign, Calendar, Mail, AlertTriangle } from 'lucide-react';

export default function ReturnsPage() {
    const sections = [
        { id: 'eligibility', title: '1. Refund Eligibility' },
        { id: 'cancellations', title: '2. Event Cancellations' },
        { id: 'processing', title: '3. Processing Times' },
        { id: 'contact', title: '4. Request a Refund' },
    ];

    const scrollToSection = (id: string) => {
        const el = document.getElementById(id);
        if (el) {
            window.scrollTo({
                top: el.offsetTop - 100,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="min-h-screen bg-dark text-white pt-24 pb-12 relative">
            <div className="container mx-auto px-4 relative z-10">
                {/* Header */}
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-primary/20">
                        <RefreshCcw className="text-primary" size={32} />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">Returns & Refunds</h1>
                    <p className="text-gray-400">Clear and transparent policies for your peace of mind.</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Sticky Sidebar */}
                    <div className="lg:w-1/4 hidden lg:block">
                        <div className="sticky top-32 bg-card border border-white/10 rounded-2xl p-6">
                            <h3 className="font-bold text-gray-500 uppercase tracking-wider text-sm mb-4">Table of Contents</h3>
                            <ul className="space-y-1">
                                {sections.map(section => (
                                    <li key={section.id}>
                                        <button
                                            onClick={() => scrollToSection(section.id)}
                                            className="text-left w-full py-2 px-3 rounded-lg text-gray-300 hover:bg-white/5 hover:text-primary transition-colors text-sm font-medium"
                                        >
                                            {section.title}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="lg:w-3/4 space-y-12">
                        <section id="eligibility" className="bg-card border border-white/5 p-8 md:p-12 rounded-3xl">
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                <span className="text-primary">01.</span> Refund Eligibility
                            </h2>
                            <div className="space-y-4 text-gray-400 leading-relaxed">
                                <p>
                                    We strive to be fair. However, because events are time-sensitive, <strong>all ticket sales are generally final</strong>. Refunds are typically only issued in specific circumstances defined by the event organizer or local laws.
                                </p>
                                <div className="p-4 bg-white/5 rounded-xl border border-white/5 mt-4">
                                    <h4 className="font-bold text-white text-sm mb-2">Common Refundable Scenarios:</h4>
                                    <ul className="list-disc pl-5 space-y-1 text-sm">
                                        <li>The event is cancelled entirely.</li>
                                        <li>The event is rescheduled and you cannot attend the new date.</li>
                                        <li>Significant changes to the main act or venue.</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        <section id="cancellations" className="bg-card border border-white/5 p-8 md:p-12 rounded-3xl">
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                <span className="text-primary">02.</span> Event Cancellations
                            </h2>
                            <div className="space-y-4 text-gray-400 leading-relaxed">
                                <p>
                                    If an event is cancelled by the organizer, you will automatically receive a full refund to your original payment method. You do not need to contact us.
                                </p>
                                <div className="flex gap-4 items-start bg-primary/10 p-4 rounded-xl border border-primary/10">
                                    <Calendar className="shrink-0 text-primary mt-1" />
                                    <div>
                                        <h4 className="text-white font-bold">Rescheduled Events</h4>
                                        <p className="text-sm">If an event is postponed, your tickets are usually valid for the new date. If you wish to claim a refund, you must do so within the deadline specified in the rescheduling email.</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section id="processing" className="bg-card border border-white/5 p-8 md:p-12 rounded-3xl">
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                <span className="text-primary">03.</span> Processing Times
                            </h2>
                            <div className="space-y-4 text-gray-400 leading-relaxed">
                                <p>
                                    Once approved, refunds are processed immediately by our system. However, it may take your bank or card issuer additional time to post the credit to your account.
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-4 border border-white/10 rounded-xl text-center">
                                        <div className="text-2xl font-bold text-white mb-1">5-7 Days</div>
                                        <div className="text-xs uppercase tracking-wide text-gray-500">Credit/Debit Cards</div>
                                    </div>
                                    <div className="p-4 border border-white/10 rounded-xl text-center">
                                        <div className="text-2xl font-bold text-white mb-1">24 Hours</div>
                                        <div className="text-xs uppercase tracking-wide text-gray-500">Wallet/UPI</div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section id="contact" className="bg-card border border-white/5 p-8 md:p-12 rounded-3xl">
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                <span className="text-primary">04.</span> Request a Refund
                            </h2>
                            <div className="space-y-4 text-gray-400 leading-relaxed">
                                <p>
                                    If you believe you are eligible for a refund based on the criteria above, please contact our support team. Include your Booking ID and the reason for your request.
                                </p>
                                <a href="mailto:support@tkthive.com" className="inline-flex items-center gap-2 text-primary hover:text-white transition-colors font-bold mt-2">
                                    <Mail size={20} /> Contact Support
                                </a>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
