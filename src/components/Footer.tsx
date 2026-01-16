"use client"
import React from 'react';
import { Twitter, Instagram, Facebook, Cpu, Gamepad2, Music, Trophy, Palette } from 'lucide-react';
import { HivePattern } from './HivePattern';
import Link from 'next/link';

interface FooterProps {
    onNavigate?: (view: 'home' | 'events' | 'about') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
    return (
        <footer className="relative pt-20 pb-12 overflow-hidden mt-20 font-sans group cursor-bee footer-global">

            {/* Partial Background for Split Effect */}
            <div className="absolute inset-x-0 bottom-0 top-[15rem] -z-50" />

            {/* Interactive Hive Pattern Background */}

            {/* Massive Watermark */}


            <div className="container mx-auto px-4 relative z-10">

                {/* CTA Card Section */}
                <div className="relative mb-20">
                    {/* Background & Clipper (Keeps bg and glow inside rounded corners) */}
                    <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden border border-white/10 bg-gradient-to-b from-white/5 to-transparent backdrop-blur-sm -z-10">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1/2 bg-primary/20 blur-[120px] rounded-full pointer-events-none opacity-50" />
                    </div>

                    {/* Content Container (Overflow visible for pop-out image) - Removed relative to let image anchor to parent */}
                    <div className="p-8 pb-0 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16">
                        <div className="text-left max-w-2xl relative z-20">
                            <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight leading-tight">
                                Your gateway to <br />
                                <span className="text-primary relative inline-block">
                                    unforgettable experiences
                                </span>
                            </h2>
                            <p className="text-base md:text-lg mb-8 opacity-80 max-w-xl">
                                Created for event enthusiasts, organizers, and first-time attendees alike.
                            </p>
                            <Link
                                href="/events"
                                className="px-8 py-4 bg-primary text-black font-bold rounded-xl hover:bg-white transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(255,165,0,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]"
                            >
                                Browse Events
                            </Link>
                        </div>

                        {/* Mascot Image - Pop out effect */}
                        {/* Mobile: Static/Relative. Desktop: Absolute (static wrapper) to anchor to main card */}

                        <div className="relative w-full md:static md:w-auto flex justify-center md:block">
                            <div className="md:absolute bottom-0 md:right-0 lg:right-12 w-72 md:w-[28rem] lg:w-[32rem] z-30 pointer-events-none">
                                <img
                                    src="/moscouttog.png"
                                    alt="Mascot"
                                    className="w-full h-auto object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500 hover:rotate-3"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Footer Content - Split Layout */}
                <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 pt-8">

                    {/* Left Side: Brand Info */}
                    <div className="lg:w-1/3 space-y-8">
                        <div
                            className="flex items-center gap-2 cursor-pointer group/brand w-fit"
                            onClick={() => onNavigate?.('home')}
                        >
                            <img src="/logo/whitelogo.png" alt="tkthive" className="h-12 w-auto object-contain group-hover/brand:opacity-80 transition-opacity" />
                        </div>
                        <p className="leading-relaxed opacity-90 text-lg max-w-sm">
                            tkthive connects you with the vibrant world of live events. Discover and secure your spot at the biggest concerts, thrilling sports matches, and cultural festivals.
                        </p>
                        <div className="flex gap-4">
                            <Twitter size={20} className="hover:text-primary cursor-pointer transition-colors opacity-70 hover:opacity-100" />
                            <Instagram size={20} className="hover:text-primary cursor-pointer transition-colors opacity-70 hover:opacity-100" />
                            <Facebook size={20} className="hover:text-primary cursor-pointer transition-colors opacity-70 hover:opacity-100" />
                        </div>
                    </div>

                    {/* Right Side: Links Grid */}
                    <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-10 md:gap-8 text-sm">

                        {/* Column 1: Categories */}
                        <div className="space-y-6">
                            <h4 className="font-bold text-lg mb-2">Categories</h4>
                            <ul className="space-y-2">
                                <li>
                                    <button onClick={() => onNavigate?.('events')} className="flex items-center gap-3 hover:text-primary transition-colors group/item">
                                        <span className="font-medium">Tech & Coding</span>
                                    </button>
                                </li>
                                <li>
                                    <button onClick={() => onNavigate?.('events')} className="flex items-center gap-3 hover:text-primary transition-colors group/item">
                                        <span className="font-medium">Esports</span>
                                    </button>
                                </li>
                                <li>
                                    <button onClick={() => onNavigate?.('events')} className="flex items-center gap-3 hover:text-primary transition-colors group/item">
                                        <span className="font-medium">Concerts</span>
                                    </button>
                                </li>
                                <li>
                                    <button onClick={() => onNavigate?.('events')} className="flex items-center gap-3 hover:text-primary transition-colors group/item">
                                        <span className="font-medium">Sports</span>
                                    </button>
                                </li>
                                <li>
                                    <button onClick={() => onNavigate?.('events')} className="flex items-center gap-3 hover:text-primary transition-colors group/item">
                                        <span className="font-medium">Arts & Culture</span>
                                    </button>
                                </li>
                            </ul>
                        </div>

                        {/* Column 2: Pages */}
                        <div className="space-y-6">
                            <h4 className="font-bold text-lg mb-2">Company</h4>
                            <ul className="space-y-3">
                                <li><button onClick={() => onNavigate?.('home')} className="hover:text-primary transition-colors">Home</button></li>
                                <li><Link href='/about' className="hover:text-primary transition-colors">About Us</Link></li>
                                <li><Link href='/support' className="hover:text-primary transition-colors">Contact</Link></li>
                                <li><Link href='/privacy' className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                            </ul>
                        </div>

                        {/* Column 3: Quick Links */}
                        <div className="space-y-6">
                            <h4 className="font-bold text-lg mb-2">Support</h4>
                            <ul className="space-y-3">
                                <li><Link href="/why-us" className="hover:text-primary transition-colors">Why buy from us?</Link></li>
                                <li><Link href="/returns" className="hover:text-primary transition-colors">Returns & Refunds</Link></li>
                                <li><Link href="/terms" className="hover:text-primary transition-colors">Terms & Conditions</Link></li>
                                <li><Link href="/faq" className="hover:text-primary transition-colors">FAQs</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center pt-12 mt-20 border-t border-white/5 text-[10px] md:text-xs uppercase tracking-wider opacity-60">
                    <p>© 2025 tkthive. All rights reserved.</p>
                    <a
                        href="https://dinestx.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary transition-colors mt-4 md:mt-0"
                    >
                        Developed by Dinex Services
                    </a>
                </div>
            </div>
        </footer>
    );
};