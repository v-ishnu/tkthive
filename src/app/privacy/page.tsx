"use client";
import React from 'react';
import { Shield, Eye, Lock, Globe, Server, UserCheck } from 'lucide-react';
import { HivePattern } from '../../components/HivePattern';

export default function PrivacyPolicy() {
    const sections = [
        { id: 'collection', title: '1. Information Collection' },
        { id: 'usage', title: '2. How We Use Data' },
        { id: 'sharing', title: '3. Data Sharing' },
        { id: 'security', title: '4. Data Security' },
        { id: 'cookies', title: '5. Cookies & Tracking' },
        { id: 'rights', title: '6. Your Rights' },
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
            <HivePattern className="opacity-20 fixed inset-0 pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">

                {/* Header */}
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-primary/20">
                        <Shield className="text-primary" size={32} />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">Privacy Policy</h1>
                    <p className="text-gray-400">Your privacy is critically important to us. Learn how we protect it.</p>
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

                        <section id="collection" className="bg-card border border-white/5 p-8 md:p-12 rounded-3xl group hover:border-white/10 transition-colors">
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-sm text-primary border border-white/10">1</span>
                                Information We Collect
                            </h2>
                            <div className="space-y-4 text-gray-400 leading-relaxed">
                                <p>We collect information that you provide directly to us, such as when you create an account, purchase a ticket, or contact support.</p>
                                <div className="grid md:grid-cols-2 gap-4 mt-6">
                                    <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                                        <UserCheck className="text-primary mb-3" />
                                        <h4 className="font-bold text-white text-sm mb-1">Personal Info</h4>
                                        <p className="text-xs">Name, email, phone number, and billing address.</p>
                                    </div>
                                    <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                                        <Server className="text-primary mb-3" />
                                        <h4 className="font-bold text-white text-sm mb-1">Usage Data</h4>
                                        <p className="text-xs">IP address, browser type, and interaction logs.</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section id="usage" className="bg-card border border-white/5 p-8 md:p-12 rounded-3xl group hover:border-white/10 transition-colors">
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-sm text-primary border border-white/10">2</span>
                                How We Use Data
                            </h2>
                            <div className="space-y-4 text-gray-400 leading-relaxed">
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>To facilitate ticket booking and event entry.</li>
                                    <li>To send you transactional emails (confirmations, invoices).</li>
                                    <li>To prevent fraud and ensure the security of our platform.</li>
                                    <li>To analyze user behavior and improve our service experience.</li>
                                </ul>
                            </div>
                        </section>

                        <section id="sharing" className="bg-card border border-white/5 p-8 md:p-12 rounded-3xl group hover:border-white/10 transition-colors">
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-sm text-primary border border-white/10">3</span>
                                Data Sharing
                            </h2>
                            <div className="space-y-4 text-gray-400 leading-relaxed">
                                <p>
                                    We do not sell your personal data. We may share your data with:
                                </p>
                                <div className="space-y-4 mt-4">
                                    <div className="flex gap-4 items-start">
                                        <Globe className="shrink-0 text-blue-400 mt-1" size={20} />
                                        <div>
                                            <h4 className="text-white font-bold">Event Organizers</h4>
                                            <p className="text-sm">Necessary details (like name and email) are shared with the organizer of the event you book for entry verification.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 items-start">
                                        <Lock className="shrink-0 text-green-400 mt-1" size={20} />
                                        <div>
                                            <h4 className="text-white font-bold">Payment Processors</h4>
                                            <p className="text-sm">Secure transmission of payment data to our banking partners (e.g., Stripe, Razorpay) to process transactions.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section id="security" className="bg-card border border-white/5 p-8 md:p-12 rounded-3xl group hover:border-white/10 transition-colors">
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-sm text-primary border border-white/10">4</span>
                                Data Security
                            </h2>
                            <div className="space-y-4 text-gray-400 leading-relaxed">
                                <p>
                                    We implement appropriate technical and organizational measures to protect your personal data against accidental or unlawful destruction, loss, change, or damage.
                                </p>
                            </div>
                        </section>

                        <section id="cookies" className="bg-card border border-white/5 p-8 md:p-12 rounded-3xl group hover:border-white/10 transition-colors">
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-sm text-primary border border-white/10">5</span>
                                Cookies & Tracking
                            </h2>
                            <div className="space-y-4 text-gray-400 leading-relaxed">
                                <p>
                                    We use cookies to enhance your experience.
                                </p>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li><strong>Essential Cookies:</strong> Required for the app to function (e.g., keeping you logged in).</li>
                                    <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with the site.</li>
                                </ul>
                            </div>
                        </section>

                        <section id="rights" className="bg-card border border-white/5 p-8 md:p-12 rounded-3xl group hover:border-white/10 transition-colors">
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-sm text-primary border border-white/10">6</span>
                                Your Rights
                            </h2>
                            <div className="space-y-4 text-gray-400 leading-relaxed">
                                <p>
                                    You have the right to request access to your personal data, correction of your personal data, or deletion of your account. Contact <a href="mailto:privacy@LOGO.com" className="text-primary hover:underline">privacy@LOGO.com</a> for requests.
                                </p>
                            </div>
                        </section>

                    </div>
                </div>
            </div>
        </div>
    );
};
