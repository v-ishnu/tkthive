import React, { useMemo } from 'react';
import { Calendar, MapPin, Clock, Ticket as TicketIcon, User, Download } from 'lucide-react';
import QRCode from 'react-qr-code';
import { toPng } from 'html-to-image';

interface TicketCardProps {
    ticket: {
        id: string;
        event: {
            title: string;
            startDate: string;
            endDate: string;
            venue?: any; // Venue | string
            location?: string;
            images?: string[];
            city?: string;
        };
        ticket: {
            name: string;
            type: string;
            price: number;
        };
        addons: any[];
        qrCode: string;
        status: string;
        unitPrice: number;
        scanned: boolean;
        createdAt: string;
    };
}

const HivePattern = () => (
    <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" width="100%" height="100%">
        <pattern id="hive-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M20 0L37.32 10V30L20 40L2.68 30V10L20 0Z" fill="none" stroke="currentColor" strokeWidth="1" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#hive-pattern)" />
    </svg>
);

const Barcode = ({ className }: { className?: string }) => (
    <div className={`flex flex-col gap-[2px] items-center justify-center opacity-70 ${className}`}>
        {[...Array(20)].map((_, i) => (
            <div key={i} className={`w-full bg-current ${Math.random() > 0.5 ? 'h-full' : 'h-3/4'}`} style={{ height: `${Math.random() * 40 + 60}%` }}></div>
        ))}
        <div className="writing-vertical text-[8px] font-mono tracking-widest mt-2 uppercase opacity-50">
            Entry Ticket
        </div>
    </div>
);


const getEventTheme = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('tech') || lowerTitle.includes('code') || lowerTitle.includes('hack') || lowerTitle.includes('dev') || lowerTitle.includes('ai')) {
        return { image: '/vector/tech.png', type: 'tech', color: 'text-cyan-400', border: 'border-cyan-500/30', bg: 'from-cyan-900/40 to-blue-900/40' };
    }
    if (lowerTitle.includes('sport') || lowerTitle.includes('match') || lowerTitle.includes('cup') || lowerTitle.includes('game') && !lowerTitle.includes('video')) {
        return { image: '/vector/sports.png', type: 'sports', color: 'text-orange-400', border: 'border-orange-500/30', bg: 'from-orange-900/40 to-red-900/40' };
    }
    if (lowerTitle.includes('music') || lowerTitle.includes('concert') || lowerTitle.includes('live') || lowerTitle.includes('band') || lowerTitle.includes('festival')) {
        return { image: '/vector/concerts.png', type: 'music', color: 'text-purple-400', border: 'border-purple-500/30', bg: 'from-purple-900/40 to-pink-900/40' };
    }
    if (lowerTitle.includes('esport') || lowerTitle.includes('gaming')) {
        return { image: '/vector/esports.png', type: 'esports', color: 'text-green-400', border: 'border-green-500/30', bg: 'from-green-900/40 to-emerald-900/40' };
    }
    return { image: '/vector/fest.png', type: 'general', color: 'text-primary', border: 'border-white/10', bg: 'from-gray-900 to-gray-800' };
};

export const TicketCard: React.FC<TicketCardProps> = ({ ticket }) => {
    const theme = useMemo(() => getEventTheme(ticket.event.title), [ticket.event.title]);

    const eventDate = new Date(ticket.event.startDate).toLocaleDateString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric'
    });
    const eventTime = new Date(ticket.event.startDate).toLocaleTimeString('en-GB', {
        hour: '2-digit', minute: '2-digit'
    });

    const displayImage = theme.image || ticket.event.images?.[0];

    const cardRef = React.useRef<HTMLDivElement>(null);

    const handleDownload = async () => {
        if (!cardRef.current) return;
        try {
            const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 3 });
            const link = document.createElement('a');
            link.download = `${ticket.event.title.replace(/\s+/g, '_')}_Ticket.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error("Ticket generation failed", err);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto my-4 filter drop-shadow-xl">
            {/* Download Button */}
            <div className="flex justify-end mb-2">
                <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full border border-white/10"
                >
                    <Download size={14} /> Download Ticket
                </button>
            </div>

            <div ref={cardRef} className={`relative flex flex-col md:flex-row bg-[#0f0f13] border ${theme.border} rounded-2xl overflow-hidden`}>

                {/* 1. Left Barcode Strip (Vertical on Desktop, Hidden Mobile) */}
                <div className="hidden md:flex w-12 bg-black/40 border-r border-dashed border-white/10 flex-col items-center justify-center py-4 relative z-20">
                    <div className="transform -rotate-90 whitespace-nowrap text-[10px] font-mono text-gray-500 tracking-[0.2em] font-bold">
                        {ticket.id.substring(0, 12).toUpperCase()}
                    </div>
                </div>

                {/* 2. Main Ticket Body */}
                <div className="relative flex-1 p-5 overflow-hidden group">
                    {/* Backgrounds */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${theme.bg} opacity-50`} />

                    {/* tkthive Watermark */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none overflow-hidden">
                        <img
                            src="/logo/whitelogo.png"
                            alt=""
                            className="w-[120%] max-w-none h-auto object-cover transform -rotate-12 scale-150"
                        />
                    </div>

                    <div className="absolute inset-0 text-white/5"><HivePattern /></div>

                    {/* Floating Vector Graphic */}
                    <div className="absolute bottom-0 right-0 w-40 h-40 opacity-20 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none transform translate-x-1/4 translate-y-1/4">
                        <img src={theme.image} alt="Theme Decor" className="w-full h-full object-contain" />
                    </div>

                    {/* Content */}
                    <div className="relative z-10 flex flex-col h-full justify-between">
                        {/* Header */}
                        <div>
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <img src="/logo/whitelogo.png" alt="tkthive" className="h-4 opacity-70" />
                                        <div className="h-3 w-px bg-white/20"></div>
                                        <p className={`text-[10px] font-bold uppercase tracking-widest ${theme.color}`}>Event Ticket</p>
                                    </div>
                                    <h2 className="text-2xl md:text-3xl font-black text-white leading-none uppercase tracking-tighter shadow-black drop-shadow-lg">
                                        {ticket.event.title}
                                    </h2>
                                </div>
                                <div className="hidden md:block">
                                    {/* Price Seal */}
                                    <div className={`w-16 h-16 rounded-full border-2 ${theme.border} flex items-center justify-center bg-black/30 backdrop-blur-sm transform rotate-12 group-hover:rotate-0 transition-transform`}>
                                        <div className="text-center">
                                            <p className="text-[8px] text-gray-400 uppercase">Price</p>
                                            <p className={`text-lg font-bold ${theme.color}`}>
                                                {ticket.ticket.price === 0 ? 'FREE' : `₹${ticket.ticket.price}`}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Meta Grid */}
                            <div className="mt-6 grid grid-cols-2 gap-4 font-mono text-xs">
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase mb-1">Date</p>
                                    <p className="text-white font-bold flex items-center">
                                        <Calendar size={12} className={`mr-2 ${theme.color}`} /> {eventDate}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase mb-1">Time</p>
                                    <p className="text-white font-bold flex items-center">
                                        <Clock size={12} className={`mr-2 ${theme.color}`} /> {eventTime}
                                    </p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-[10px] text-gray-500 uppercase mb-1">Venue</p>
                                    <p className="text-white font-bold flex items-start break-words" title={ticket.event.venue?.name || ticket.event.location || ticket.event.city}>
                                        <MapPin size={12} className={`mr-2 mt-0.5 shrink-0 ${theme.color}`} />
                                        <span>
                                            {ticket.event.venue?.name ? `${ticket.event.venue.name}, ${ticket.event.venue.city || ''}` : (ticket.event.city || "TBA")}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Footer / Addons */}
                        <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap gap-2">
                            <div className="flex items-center space-x-2">
                                <span className="bg-white/5 border border-white/10 rounded px-2 py-0.5 text-[10px] text-gray-300 font-mono">
                                    {ticket.ticket.name}
                                </span>
                                <span className={`border ${theme.border} rounded px-2 py-0.5 text-[10px] ${theme.color} font-mono uppercase bg-black/20`}>
                                    {ticket.ticket.type}
                                </span>
                                {ticket.status === 'CONFIRMED' && (
                                    <span className="bg-green-500/10 border border-green-500/20 text-green-400 px-2 py-0.5 text-[10px] rounded font-bold uppercase">
                                        Confirmed
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Divider (Perforation) */}
                <div className="relative hidden md:flex flex-col items-center justify-between w-6 bg-[#0f0f13] z-20">
                    <div className="absolute top-0 -translate-y-1/2 w-4 h-4 bg-black rounded-full border border-white/10"></div>
                    <div className="h-full border-l-2 border-dashed border-white/20 mx-auto"></div>
                    <div className="absolute bottom-0 translate-y-1/2 w-4 h-4 bg-black rounded-full border border-white/10"></div>
                </div>

                {/* Mobile Horizontal Divider */}
                <div className="md:hidden relative h-6 bg-[#0f0f13] flex items-center z-20 overflow-hidden">
                    <div className="absolute left-0 -translate-x-1/2 w-4 h-4 bg-black rounded-full"></div>
                    <div className="w-full border-t-2 border-dashed border-white/20"></div>
                    <div className="absolute right-0 translate-x-1/2 w-4 h-4 bg-black rounded-full"></div>
                </div>

                {/* 4. Stub / QR Section */}
                <div className="relative w-full md:w-36 bg-[#14151a] p-4 flex flex-col items-center justify-center text-center">
                    <div className="bg-white p-2 rounded-lg mb-3 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                        <QRCode
                            size={100}
                            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                            value={ticket.qrCode}
                            viewBox={`0 0 256 256`}
                        />
                    </div>

                    <div className="space-y-1 w-full">
                        <p className="text-[8px] text-gray-500 uppercase tracking-widest font-mono">Scan for Entry</p>
                        <div className="h-px w-full bg-white/10 my-2"></div>
                        <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                            <span>ID:</span>
                            <span className="text-white">{ticket.id.slice(-6).toUpperCase()}</span>
                        </div>
                        <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                            <span>Price:</span>
                            <span className="text-white">₹{ticket.unitPrice}</span>
                        </div>
                    </div>



                    {ticket.scanned && (
                        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                            <div className="border-2 border-red-500 text-red-500 font-black text-xl uppercase px-3 py-1 transform -rotate-12 rounded-lg shadow-2xl">
                                SCANNED
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
