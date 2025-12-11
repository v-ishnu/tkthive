
import React from 'react';
import { MapPin, Calendar, Clock, QrCode } from 'lucide-react';
import { Ticket } from '../types';

interface TicketCardProps {
  ticket: Ticket;
}

export const TicketCard: React.FC<TicketCardProps> = ({ ticket }) => {
  
  // Determine theme based on event title/type hints (Mock logic)
  const getTheme = () => {
    const title = ticket.eventTitle.toLowerCase();
    if (title.includes('music') || title.includes('concert') || title.includes('fest') || title.includes('dj')) {
      return {
        gradient: 'from-purple-900 to-pink-800',
        accent: 'text-pink-400',
        border: 'border-pink-500/30',
        icon: '🎵',
        pattern: 'bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent opacity-30'
      };
    }
    if (title.includes('tech') || title.includes('hackathon') || title.includes('dev') || title.includes('summit')) {
      return {
        gradient: 'from-blue-900 to-cyan-900',
        accent: 'text-cyan-400',
        border: 'border-cyan-500/30',
        icon: '💻',
        pattern: 'bg-[linear-gradient(45deg,_#ffffff10_25%,_transparent_25%,_transparent_50%,_#ffffff10_50%,_#ffffff10_75%,_transparent_75%,_transparent)] bg-[length:20px_20px]'
      };
    }
    if (title.includes('sport') || title.includes('match') || title.includes('league') || title.includes('run')) {
      return {
        gradient: 'from-orange-900 to-red-900',
        accent: 'text-orange-400',
        border: 'border-orange-500/30',
        icon: '🏆',
        pattern: 'bg-[radial-gradient(#ffffff10_1px,_transparent_1px)] bg-[length:16px_16px]'
      };
    }
    // Default Dark/Gold
    return {
      gradient: 'from-gray-900 to-gray-800',
      accent: 'text-primary',
      border: 'border-primary/30',
      icon: '🎫',
      pattern: ''
    };
  };

  const theme = getTheme();

  return (
    <div className="relative w-full max-w-4xl mx-auto filter drop-shadow-2xl transform transition-transform hover:scale-[1.01]">
      <div className="flex flex-col md:flex-row w-full rounded-3xl overflow-hidden relative">
        
        {/* Left Section - Main Info */}
        <div className={`relative flex-1 bg-gradient-to-br ${theme.gradient} p-5 md:p-6 text-white border-b-2 md:border-b-0 md:border-r-2 border-dashed border-white/20`}>
            {/* Background Pattern & Image */}
            <div className={`absolute inset-0 ${theme.pattern}`} />
            <div className="absolute right-0 top-0 w-2/3 h-full opacity-20">
                <img src={ticket.eventImage} alt="" className="w-full h-full object-cover mask-image-linear-gradient" style={{ maskImage: 'linear-gradient(to left, black, transparent)' }} />
            </div>
            
            {/* Branding Watermark */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[60px] md:text-[80px] font-bold text-white/5 pointer-events-none whitespace-nowrap leading-none">
                TKTHIVE
            </div>

            <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                    <div className="flex justify-between items-center mb-3">
                        <span className={`px-2.5 py-0.5 rounded-full bg-black/30 backdrop-blur border ${theme.border} ${theme.accent} text-[10px] font-bold uppercase tracking-widest`}>
                            {theme.icon} {ticket.ticketType}
                        </span>
                        <span className="text-white/50 font-mono text-[10px]">#{ticket.id.slice(-8).toUpperCase()}</span>
                    </div>

                    <h2 className="text-2xl md:text-3xl font-black uppercase leading-tight mb-3 text-white drop-shadow-md line-clamp-2">
                        {ticket.eventTitle}
                    </h2>

                    <div className="grid grid-cols-2 gap-4 mb-3">
                        <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5 text-white/60 text-[10px] uppercase tracking-wider font-bold">
                                <Calendar size={12} /> Date
                            </div>
                            <div className="text-sm md:text-base font-bold">{ticket.eventDate.split(',')[0]}</div>
                            <div className="text-xs text-white/80 truncate">{ticket.eventDate.split(',').slice(1).join(',')}</div>
                        </div>
                        <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5 text-white/60 text-[10px] uppercase tracking-wider font-bold">
                                <Clock size={12} /> Time
                            </div>
                            <div className="text-sm md:text-base font-bold">20:00</div>
                            <div className="text-xs text-white/80">Doors Open 18:00</div>
                        </div>
                    </div>

                    <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-white/60 text-[10px] uppercase tracking-wider font-bold">
                            <MapPin size={12} /> Venue
                        </div>
                        <div className="text-sm md:text-base font-bold truncate w-full">{ticket.eventVenue}</div>
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-end">
                    <div>
                        <div className="text-white/60 text-[10px] uppercase tracking-wider font-bold mb-0.5">Admit</div>
                        <div className="text-lg md:text-xl font-bold">{ticket.attendees} <span className="text-xs font-normal text-white/60">Person(s)</span></div>
                    </div>
                    <div className="text-right">
                        <div className="text-white/60 text-[10px] uppercase tracking-wider font-bold mb-0.5">Paid</div>
                        <div className={`text-lg md:text-xl font-bold ${theme.accent}`}>{ticket.price}</div>
                    </div>
                </div>
            </div>

            {/* Perforation Circles */}
            <div className="hidden md:block absolute -right-3 top-0 w-6 h-6 bg-dark rounded-full" />
            <div className="hidden md:block absolute -right-3 bottom-0 w-6 h-6 bg-dark rounded-full" />
            
            {/* Mobile Bottom Perforations */}
            <div className="md:hidden absolute -bottom-3 left-0 w-6 h-6 bg-dark rounded-full" />
            <div className="md:hidden absolute -bottom-3 right-0 w-6 h-6 bg-dark rounded-full" />
        </div>

        {/* Right Section - Stub (QR Code) */}
        <div className="relative w-full md:w-64 bg-white text-black p-5 flex flex-col items-center justify-between">
            <div className="text-center space-y-0.5 border-b-2 border-black/10 w-full pb-3 border-dashed">
                <div className="font-bold text-xl tracking-tight uppercase">tkthive</div>
                <div className="text-[8px] text-gray-500 tracking-[0.2em] uppercase">Official Ticket</div>
            </div>

            <div className="my-4 md:my-2 flex-1 flex flex-col items-center justify-center w-full">
                <div className="bg-white p-1.5 rounded-xl border-4 border-black">
                    <QrCode size={100} className="text-black" />
                </div>
                <div className="mt-1 text-[10px] font-mono text-gray-500 text-center">
                    Scan at entry
                </div>
            </div>

            <div className="w-full space-y-2 text-center">
                {ticket.seat && ticket.row ? (
                    <div className="grid grid-cols-2 gap-2 text-left bg-gray-100 p-2 rounded-lg">
                        <div>
                            <div className="text-[9px] text-gray-500 uppercase font-bold">Row</div>
                            <div className="font-mono font-bold text-base">{ticket.row}</div>
                        </div>
                        <div className="text-right">
                            <div className="text-[9px] text-gray-500 uppercase font-bold">Seat</div>
                            <div className="font-mono font-bold text-base">{ticket.seat}</div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-gray-100 p-2 rounded-lg text-center">
                        <div className="text-[9px] text-gray-500 uppercase font-bold">Access</div>
                        <div className="font-mono font-bold text-sm">General Entry</div>
                    </div>
                )}
                
                {/* Fake Barcode */}
                <div className="h-8 w-full flex flex-col items-center justify-end opacity-60">
                    <div className="w-full h-full bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Code_39_barcode.svg/1200px-Code_39_barcode.svg.png')] bg-cover bg-center" />
                </div>
            </div>

            {/* Perforation Circles for Mobile (Top instead of left) */}
            <div className="md:hidden absolute -top-3 left-0 w-6 h-6 bg-dark rounded-full" />
            <div className="md:hidden absolute -top-3 right-0 w-6 h-6 bg-dark rounded-full" />
            
            {/* Desktop Left Perforations */}
            <div className="hidden md:block absolute -left-3 top-0 w-6 h-6 bg-dark rounded-full" />
            <div className="hidden md:block absolute -left-3 bottom-0 w-6 h-6 bg-dark rounded-full" />
        </div>
      </div>
    </div>
  );
};
