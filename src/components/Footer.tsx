"use client"
import React from 'react';
import { Twitter, Instagram, Facebook } from 'lucide-react';
import { HivePattern } from './HivePattern';
import Link from 'next/link';

interface FooterProps {
  onNavigate?: (view: 'home' | 'events' | 'about') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="relative bg-black pt-32 pb-12 overflow-hidden mt-20 border-t border-white/5 font-sans group cursor-bee">
      
      {/* Interactive Hive Pattern Background */}
      <HivePattern className="opacity-40" />

      {/* Massive Watermark */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full text-center pointer-events-none select-none z-0">
        <h1 className="text-[18vw] font-black text-transparent bg-clip-text bg-gradient-to-b from-white/[0.05] via-white/[0.02] to-transparent leading-none tracking-tighter opacity-50">
          LOGO
        </h1>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        
        {/* Top CTA Section */}
        <div className="text-center max-w-4xl mx-auto mb-24">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                Join 50,000+ creators <br/>
                <span className="text-primary relative inline-block">
                    growing their events with us
                </span>
            </h2>
            <p className="text-gray-500 text-base md:text-lg mb-8 max-w-xl mx-auto">
                Get premium event management tools at wholesale prices — fast setup, verified ticketing, and dedicated support for your success.
            </p>
            
            {/* Partners/Logos Row */}
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
                 <span className="text-lg font-bold text-white uppercase tracking-widest hover:text-primary cursor-default transition-colors">Spotify</span>
                 <span className="text-lg font-bold text-white uppercase tracking-widest hover:text-primary cursor-default transition-colors">LiveNation</span>
                 <span className="text-lg font-bold text-white uppercase tracking-widest hover:text-primary cursor-default transition-colors">Ticketmaster</span>
                 <span className="text-lg font-bold text-white uppercase tracking-widest hover:text-primary cursor-default transition-colors">RedBull</span>
            </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-8 text-sm border-t border-white/5 pt-16">
            
            {/* Brand / Logo Column */}
            <div className="col-span-2 md:col-span-1 space-y-6">
                <div 
                  className="flex items-center gap-2 cursor-pointer group/brand w-fit"
                  onClick={() => onNavigate?.('home')}
                >
                    <span className="text-2xl font-bold tracking-tighter text-white group-hover/brand:text-primary transition-colors">LOGO</span>
                </div>
                <p className="text-gray-600 leading-relaxed max-w-xs">
                    LOGO offers a comprehensive selection of wholesale event products. Our inventory boasts a diverse range of concerts, sports, and more.
                </p>
            </div>

            {/* Column 1 */}
            <div className="space-y-6">
                <h4 className="text-white font-bold mb-4">Categories</h4>
                <ul className="space-y-3 text-gray-500">
                    <li><button onClick={() => onNavigate?.('events')} className="hover:text-primary transition-colors">Concerts</button></li>
                    <li><button onClick={() => onNavigate?.('events')} className="hover:text-primary transition-colors">Sports</button></li>
                    <li><button onClick={() => onNavigate?.('events')} className="hover:text-primary transition-colors">Theater</button></li>
                    <li><button onClick={() => onNavigate?.('events')} className="hover:text-primary transition-colors">Festivals</button></li>
                    <li><button onClick={() => onNavigate?.('events')} className="hover:text-primary transition-colors">Workshops</button></li>
                </ul>
            </div>

            {/* Column 2 */}
            <div className="space-y-6">
                <h4 className="text-white font-bold mb-4">Pages</h4>
                <ul className="space-y-3 text-gray-500">
                    <li><button onClick={() => onNavigate?.('home')} className="hover:text-primary transition-colors">Home</button></li>
                    <li><button onClick={() => onNavigate?.('events')} className="hover:text-primary transition-colors">Shop</button></li>
                    <li><Link href='/about' className="hover:text-primary transition-colors">About Us</Link></li>
                    <li><Link href='/support' className="hover:text-primary transition-colors">Contact and Support</Link></li>
                    <li><Link href='/privacy' className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                </ul>
            </div>

            {/* Column 3 */}
            <div className="space-y-6">
                <h4 className="text-white font-bold mb-4">Quick Links</h4>
                <ul className="space-y-3 text-gray-500">
                    <li><button className="hover:text-primary transition-colors">Benefits for retailers</button></li>
                    <li><button className="hover:text-primary transition-colors">Why buy from us?</button></li>
                    <li><button className="hover:text-primary transition-colors">Delivery Information</button></li>
                    <li><button className="hover:text-primary transition-colors">FAQs</button></li>
                </ul>
            </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-16 mt-12 text-[10px] md:text-xs text-gray-600 uppercase tracking-wider">
            <p>Privacy Policy . Returns and Refunds . Terms and Conditions</p>
            <div className="flex gap-6 mt-4 md:mt-0">
                <p>© 2025 LOGO. All rights reserved.</p>
                <div className="flex gap-4">
                    <Twitter size={14} className="hover:text-primary cursor-pointer transition-colors" />
                    <Instagram size={14} className="hover:text-primary cursor-pointer transition-colors" />
                    <Facebook size={14} className="hover:text-primary cursor-pointer transition-colors" />
                </div>
            </div>
        </div>
      </div>
    </footer>
  );
};