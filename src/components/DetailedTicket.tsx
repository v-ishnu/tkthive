import React, { useRef } from 'react';
import { Download, Calendar, Clock, MapPin, User, Ticket as TicketIcon, CreditCard, Scissors } from 'lucide-react';
import { toPng } from 'html-to-image';
import QRCode from 'react-qr-code';

interface DetailedTicketProps {
    ticket: {
        id: string;
        event: {
            title: string;
            startDate: string;
            endDate?: string;
            venue?: { name: string; city: string; address?: string };
            location?: string;
            city?: string;
            organizer?: { name: string; logo?: string };
            images?: string[];
        };
        ticket: {
            name: string; // e.g. "VIP Pass"
            type: string; // e.g. "Early Bird"
            price: number;
        };
        booking?: {
            payment: number;
            discount?: number;
            appliedCoupon?: string;
            paymentStatus: string;
            bookingDate?: string;
        };
        registrationData?: {
            name?: string;
            email?: string;
            phone?: string;
            [key: string]: any;
        };
        qrCode: string;
        attendeeName?: string;
        status?: string;
        scanned?: boolean;
    };
}

const DetailedTicket: React.FC<DetailedTicketProps> = ({ ticket }) => {
    const cardRef = useRef<HTMLDivElement>(null);

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

    // Format dates
    const startDate = new Date(ticket.event.startDate);
    const dateStr = startDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    const timeStr = startDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    const attendeeName = ticket.registrationData?.name || ticket.attendeeName || "Guest";

    // Dark Theme Colors
    const bgMain = "bg-[#0f0f13]"; // Dark background similar to TicketCard
    const bgSecondary = "bg-[#18181b]"; // Slightly lighter for contrast
    const textPrimary = "text-white";
    const textSecondary = "text-gray-400";
    const accentColor = "text-indigo-400";
    const borderOne = "border-white/10";

    return (
        <div className="w-full flex flex-col items-center">
            <div className="flex justify-end w-full max-w-3xl mb-2">
                <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full border border-white/10"
                >
                    <Download size={14} /> Download
                </button>
            </div>

            <div ref={cardRef} className={`w-full max-w-3xl ${bgMain} ${textPrimary} rounded-2xl overflow-hidden shadow-2xl relative flex flex-col md:flex-row border ${borderOne} min-h-[320px]`}>

                {/* Background Pattern/Texture */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.05]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='1'/%3E%3Ccircle cx='13' cy='13' r='1'/%3E%3C/g%3E%3C/svg%3E")` }}></div>

                {/* LEFT SECTION: MAIN CONTENT */}
                <div className="flex-1 p-6 relative z-10 flex flex-col justify-between">

                    {/* Header: Organizer & Branding */}
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-4">
                            {/* Organizer Logo - INCREASED SIZE */}
                            <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center text-xs font-bold text-black border border-white/20 overflow-hidden">
                                {ticket.event.organizer?.logo || (ticket.event.organizer as any)?.logoUrl ? (
                                    <img src={ticket.event.organizer?.logo || (ticket.event.organizer as any)?.logoUrl} alt="Org" className="w-full h-full object-contain p-2" />
                                ) : "LOGO"}
                            </div>
                            <div>
                                <h3 className={`text-[10px] font-bold ${textSecondary} uppercase tracking-widest`}>Presented By</h3>
                                <p className="font-bold text-xl leading-none tracking-tight">{ticket.event.organizer?.name || "Event Organizer"}</p>
                            </div>
                        </div>

                        {/* Status Tag */}
                        <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${ticket.status === 'CONFIRMED' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'}`}>
                            {ticket.status || ticket.ticket.type}
                        </div>
                    </div>

                    {/* Event Title & Date */}
                    <div className="mb-6">
                        <h1 className="text-xl md:text-2xl font-semibold font-[family-name:var(--font-poppins)] uppercase leading-none  mb-3 shadow-black drop-shadow-lg text-white">
                            {ticket.event.title}
                        </h1>
                        <div className={`flex flex-wrap gap-4 text-xs font-bold ${textSecondary}`}>
                            <div className="flex items-center gap-1.5">
                                <Calendar size={14} className={accentColor} />
                                <span>{dateStr}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Clock size={14} className={accentColor} />
                                <span>{timeStr}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <MapPin size={14} className={accentColor} />
                                <span className="truncate max-w-[200px]">{ticket.event.venue?.name || ticket.event.location || "TBA"}</span>
                            </div>
                        </div>
                    </div>

                    {/* User & Booking Info Grid - Compact */}
                    {/* User & Booking Info Grid - Compact */}
                    <div className="py-4 border-t border-dashed border-white/10">
                        <div className="grid grid-cols-3 gap-4 mb-4">
                            <div>
                                <p className="text-[10px] font-bold text-gray-500 uppercase mb-0.5">Attendee</p>
                                <p className="font-bold text-sm leading-tight truncate text-white">{attendeeName}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-500 uppercase mb-0.5">Booking ID</p>
                                <p className="font-mono text-xs text-gray-400 truncate">{ticket.id.slice(-8).toUpperCase()}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-500 uppercase mb-0.5">Price</p>
                                <p className={`font-bold text-sm leading-tight ${accentColor}`}>₹{(ticket.booking?.payment ?? ticket.ticket.price).toFixed(2)}</p>
                            </div>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-500 uppercase mb-0.5">Ticket</p>
                            <p className="font-bold text-sm leading-tight text-white">{ticket.ticket.name}</p>
                        </div>
                    </div>

                    {/* Branding Footer */}
                    <div className="flex items-center gap-2 opacity-80 mt-1">
                        <img src="/logo/whitelogo.png" alt="Tkthive" className="h-5" />
                        <span className="text-[8px] font-bold uppercase tracking-widest text-white">Official Ticket</span>
                    </div>

                    {/* Mascot */}
                    <img loading='lazy' src="/moscouttog.png" alt="Mascot" className=" absolute bottom-0 right-0 w-24 h-auto object-contain z-0 opacity-80" />

                </div>

                {/* Vertical Divider for Desktop */}
                <div className="hidden md:flex flex-col items-center justify-between w-6 bg-[#0f0f13] z-20 relative">
                    <div className="absolute top-0 -translate-y-1/2 w-5 h-5 bg-black rounded-full border border-white/10"></div>
                    <div className="h-full border-l-2 border-dashed border-white/10 mx-auto"></div>
                    <div className="absolute bottom-0 translate-y-1/2 w-5 h-5 bg-black rounded-full border border-white/10"></div>
                </div>

                {/* Horizontal Divider for Mobile */}
                <div className="md:hidden relative h-6 bg-[#0f0f13] flex items-center z-20 overflow-hidden w-full">
                    <div className="absolute left-0 -translate-x-1/2 w-4 h-4 bg-black rounded-full border-r border-white/10"></div>
                    <div className="w-full border-t-2 border-dashed border-white/10"></div>
                    <div className="absolute right-0 translate-x-1/2 w-4 h-4 bg-black rounded-full border-l border-white/10"></div>
                </div>

                {/* RIGHT SECTION: STUB & QR */}
                <div className={`relative w-full md:w-64 ${bgSecondary} flex flex-col items-center justify-center p-6 z-10`}>

                    {/* QR Code Wrapper */}
                    <div className="w-full flex flex-col items-center mb-4">
                        <div className="p-2 bg-white rounded-lg shadow-[0_0_15px_rgba(255,255,255,0.1)] mb-3">
                            <QRCode
                                size={120}
                                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                value={ticket.qrCode}
                                viewBox={`0 0 256 256`}
                            />
                        </div>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center">Scan at Gate</p>
                    </div>


                    {/* Bottom Details */}
                    <div className="w-full text-center space-y-2">
                        {ticket.booking?.discount && ticket.booking.discount > 0 && (
                            <div className="text-[10px] text-green-400 font-mono">
                                Coupon Applied: -₹{ticket.booking.discount}
                            </div>
                        )}

                        {ticket.booking?.paymentStatus === 'PAID' && (
                            <div className="inline-block px-3 py-1 bg-green-500/10 text-green-400 text-[10px] font-black uppercase tracking-widest rounded border border-green-500/20">
                                PAID
                            </div>
                        )}
                        {ticket.scanned && (
                            <div className="mt-2 text-red-500 font-black text-lg uppercase -rotate-6 border-2 border-red-500 px-2 rounded opacity-80">
                                SCANNED
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default DetailedTicket;
