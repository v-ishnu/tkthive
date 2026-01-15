'use client';
import React from 'react';
import { HelpCircle, ChevronDown, Ticket, CreditCard, User, AlertCircle } from 'lucide-react';

export default function FAQPage() {
    const faqs = [
        {
            category: "Ticketing",
            icon: <Ticket className="text-primary" />,
            items: [
                { q: "How do I receive my tickets?", a: "Tickets are emailed to you instantly after purchase. You can also view and download them from the 'My Tickets' section in your profile." },
                { q: "Do I need to print my ticket?", a: "No! TktHive tickets are mobile-friendly. You can simply show the QR code on your phone at the venue." },
                { q: "Can I transfer my ticket to someone else?", a: "Yes, you can transfer tickets from your dashboard. The recipient will receive a new QR code." }
            ]
        },
        {
            category: "Payments",
            icon: <CreditCard className="text-primary" />,
            items: [
                { q: "What payment methods do you accept?", a: "We accept all major credit/debit cards, UPI, and net banking options depending on your region." },
                { q: "Is my payment information secure?", a: "Absolutely. We use industry-standard encryption and do not store your card details on our servers." }
            ]
        },
        {
            category: "Account & Support",
            icon: <User className="text-primary" />,
            items: [
                { q: "I forgot my password.", a: "Click 'Forgot Password' on the login screen to receive a reset link via email." },
                { q: "How can I contact the event organizer?", a: "You can find a 'Contact Organizer' button on the specific event page or in your booking confirmation email." }
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-dark text-white pt-24 pb-12 relative">
            <div className="container mx-auto px-4 relative z-10">

                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-primary/20">
                        <HelpCircle className="text-primary" size={32} />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">Frequently Asked Questions</h1>
                    <p className="text-gray-400">Find answers to common questions about TktHive.</p>
                </div>

                <div className="max-w-4xl mx-auto space-y-12">
                    {faqs.map((section, idx) => (
                        <div key={idx} className="bg-card border border-white/5 rounded-3xl p-8 md:p-10">
                            <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-6">
                                <div className="p-2 bg-white/5 rounded-lg border border-white/10">
                                    {section.icon}
                                </div>
                                <h2 className="text-2xl font-bold">{section.category}</h2>
                            </div>

                            <div className="space-y-6">
                                {section.items.map((item, i) => (
                                    <div key={i} className="group">
                                        <h3 className="font-bold text-lg text-white mb-2 group-hover:text-primary transition-colors flex items-start gap-2">
                                            <span className="text-primary/50 text-sm mt-1">Q.</span> {item.q}
                                        </h3>
                                        <p className="text-gray-400 leading-relaxed pl-6 border-l-2 border-white/5 ml-1.5">
                                            {item.a}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* Still need help CTA */}
                    <div className="bg-primary/10 border border-primary/20 rounded-3xl p-8 text-center">
                        <h3 className="text-xl font-bold mb-2">Still have questions?</h3>
                        <p className="text-gray-400 mb-6">We're here to help you 24/7.</p>
                        <a href="mailto:support@tkthive.com" className="bg-primary hover:bg-white text-black font-bold px-8 py-3 rounded-full transition-colors inline-block">
                            Contact Support
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
