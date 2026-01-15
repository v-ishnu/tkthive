'use client'
import React from 'react';
import { Shield, Lock, FileText, AlertCircle } from 'lucide-react';

export default function TermsPage() {
    const sections = [
        { id: 'intro', title: '1. Introduction' },
        { id: 'user-accounts', title: '2. User Accounts' },
        { id: 'bookings', title: '3. Bookings & Payments' },
        { id: 'refunds', title: '4. Refunds & Cancellations' },
        { id: 'content', title: '5. User Content' },
        { id: 'liability', title: '6. Limitation of Liability' },
    ];

    const scrollToSection = (id: string) => {
        const el = document.getElementById(id);
        if (el) {
            window.scrollTo({
                top: el.offsetTop - 100, // Offset for sticky header
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="min-h-screen bg-dark text-white pt-24 pb-12 relative">


            <div className="container mx-auto px-4">

                {/* Header */}
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/10">
                        <FileText className="text-primary" size={32} />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">Terms & Conditions</h1>
                    <p className="text-gray-400">Last Updated: September 20, 2025</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-12 relative">

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

                        <section id="intro" className="bg-card border border-white/5 p-8 md:p-12 rounded-3xl">
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                <span className="text-primary">01.</span> Introduction
                            </h2>
                            <div className="space-y-4 text-gray-400 leading-relaxed">
                                <p>
                                    Welcome to <strong>tkthive</strong>. By accessing our website, mobile application, or any other services (collectively, the "Service"), you agree to be bound by these Terms and Conditions ("Terms"). Please read them carefully.
                                </p>
                                <p>
                                    If you do not agree to these Terms, you may not use the Service. We reserve the right to modify these Terms at any time, and your continued use of the Service constitutes acceptance of such modifications.
                                </p>
                            </div>
                        </section>

                        <section id="user-accounts" className="bg-card border border-white/5 p-8 md:p-12 rounded-3xl">
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                <span className="text-primary">02.</span> User Accounts
                            </h2>
                            <div className="space-y-4 text-gray-400 leading-relaxed">
                                <div className="flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/5 mb-6">
                                    <Shield className="text-primary shrink-0 mt-1" />
                                    <p className="text-sm">You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.</p>
                                </div>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>You must be at least 13 years old to use the Service.</li>
                                    <li>You must provide accurate and complete information when creating an account.</li>
                                    <li>You may not use the Service for any illegal or unauthorized purpose.</li>
                                </ul>
                            </div>
                        </section>

                        <section id="bookings" className="bg-card border border-white/5 p-8 md:p-12 rounded-3xl">
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                <span className="text-primary">03.</span> Bookings & Payments
                            </h2>
                            <div className="space-y-4 text-gray-400 leading-relaxed">
                                <p>
                                    All ticket purchases are final. When you purchase a ticket, you are entering into a binding contract with the event organizer. <strong>tkthive</strong> acts as an agent for the organizer.
                                </p>
                                <p>
                                    Prices are set by the organizer and may include a booking fee. All fees are non-refundable unless otherwise stated.
                                </p>
                                <div className="flex items-center gap-3 mt-4 text-white">
                                    <Lock size={18} className="text-green-500" />
                                    <span className="font-bold">Payments are processed securely via SSL encryption.</span>
                                </div>
                            </div>
                        </section>

                        <section id="refunds" className="bg-card border border-white/5 p-8 md:p-12 rounded-3xl">
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                <span className="text-primary">04.</span> Refunds & Cancellations
                            </h2>
                            <div className="space-y-4 text-gray-400 leading-relaxed">
                                <p>
                                    Refund policies vary by event. Generally:
                                </p>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li><strong>Event Cancellation:</strong> If an event is cancelled, you will be entitled to a full refund of the ticket price.</li>
                                    <li><strong>Rescheduling:</strong> If an event is rescheduled, your ticket will be valid for the new date. You may request a refund if you cannot attend the new date.</li>
                                    <li><strong>Personal Reasons:</strong> Refunds for personal reasons are subject to the organizer's discretion and are not guaranteed.</li>
                                </ul>
                            </div>
                        </section>

                        <section id="content" className="bg-card border border-white/5 p-8 md:p-12 rounded-3xl">
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                <span className="text-primary">05.</span> User Content
                            </h2>
                            <div className="space-y-4 text-gray-400 leading-relaxed">
                                <p>
                                    By posting reviews, photos, or other content ("User Content"), you grant <strong>tkthive</strong> a non-exclusive, royalty-free, perpetual, and worldwide license to use, display, and distribute such content.
                                </p>
                                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
                                    <AlertCircle className="text-red-400 shrink-0 mt-1" />
                                    <p className="text-sm text-red-200">
                                        Hate speech, harassment, and illegal content are strictly prohibited and will result in immediate account termination.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section id="liability" className="bg-card border border-white/5 p-8 md:p-12 rounded-3xl">
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                <span className="text-primary">06.</span> Limitation of Liability
                            </h2>
                            <div className="space-y-4 text-gray-400 leading-relaxed">
                                <p>
                                    To the maximum extent permitted by law, <strong>tkthive</strong> shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues.
                                </p>
                            </div>
                        </section>

                    </div>
                </div>
            </div>
        </div>
    );
};
