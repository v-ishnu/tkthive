import React, { useRef } from 'react';
import { Download } from 'lucide-react';
import { toPng } from 'html-to-image';

interface ESummitTicketProps {
    ticket: any; // Using any to be flexible with incoming ticket data structure
    attendeeName: string;
    collegeName: string;
}

const ESummitTicket: React.FC<ESummitTicketProps> = ({ ticket, attendeeName, collegeName }) => {
    const cardRef = useRef<HTMLDivElement>(null);

    const handleDownload = async () => {
        if (!cardRef.current) return;
        try {
            const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 3 });
            const link = document.createElement('a');
            link.download = `E-Summit_26_Ticket_${attendeeName.replace(/\s+/g, '_')}.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error("Ticket generation failed", err);
        }
    };

    return (
        <div className="w-full max-w-[1000px] mx-auto my-8">
            <div className="flex justify-end mb-4">
                <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 transition-colors px-4 py-2 rounded-full shadow-lg"
                >
                    <Download size={16} /> Download Ticket
                </button>
            </div>

            {/* Container for SVG to ensure it captures properly */}
            <div ref={cardRef} className="relative rounded-xl overflow-hidden shadow-2xl">
                <svg width="100%" viewBox="0 0 1000 300" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
                    <defs>
                        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" style={{ stopColor: "#020005", stopOpacity: 1 }} />
                            <stop offset="30%" style={{ stopColor: "#1a0b2e", stopOpacity: 1 }} />
                            <stop offset="100%" style={{ stopColor: "#5d329e", stopOpacity: 1 }} />
                        </linearGradient>

                        <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" style={{ stopColor: "#e0c3fc", stopOpacity: 1 }} />
                            <stop offset="50%" style={{ stopColor: "#ffffff", stopOpacity: 1 }} />
                            <stop offset="100%" style={{ stopColor: "#c49bf5", stopOpacity: 1 }} />
                        </linearGradient>

                        <style>
                            {`
                                @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;800&display=swap');
                                .font-main { font-family: 'Montserrat', sans-serif; }
                            `}
                        </style>
                    </defs>

                    <rect x="0" y="0" width="1000" height="300" fill="url(#bgGradient)" rx="0" ry="0" />

                    <g opacity="0.15" stroke="#ffffff" strokeWidth="0.5" fill="none">
                        <path d="M 300 300 C 500 250, 600 50, 800 0" />
                        <path d="M 310 300 C 510 250, 610 50, 810 0" />
                        <path d="M 320 300 C 520 250, 620 50, 820 0" />
                        <path d="M 330 300 C 530 250, 630 50, 830 0" />
                        <path d="M 340 300 C 540 250, 640 50, 840 0" />
                        <path d="M 350 300 C 550 250, 650 50, 850 0" />
                        <path d="M 360 300 C 560 250, 660 50, 860 0" />
                        <path d="M 370 300 C 570 250, 670 50, 870 0" />
                        <path d="M 380 300 C 580 250, 680 50, 880 0" />
                        <path d="M 390 300 C 590 250, 690 50, 890 0" />
                        <path d="M 400 300 C 600 250, 700 50, 900 0" />
                    </g>

                    <circle cx="0" cy="30" r="12" fill="white" />
                    <circle cx="0" cy="78" r="12" fill="white" />
                    <circle cx="0" cy="126" r="12" fill="white" />
                    <circle cx="0" cy="174" r="12" fill="white" />
                    <circle cx="0" cy="222" r="12" fill="white" />
                    <circle cx="0" cy="270" r="12" fill="white" />

                    <circle cx="1000" cy="30" r="12" fill="white" />
                    <circle cx="1000" cy="78" r="12" fill="white" />
                    <circle cx="1000" cy="126" r="12" fill="white" />
                    <circle cx="1000" cy="174" r="12" fill="white" />
                    <circle cx="1000" cy="222" r="12" fill="white" />
                    <circle cx="1000" cy="270" r="12" fill="white" />

                    <line x1="750" y1="20" x2="750" y2="280" stroke="white" strokeWidth="4" strokeDasharray="10, 10" />
                    <circle cx="750" cy="0" r="20" fill="white" />
                    <circle cx="750" cy="300" r="20" fill="white" />

                    <g transform="translate(85, 80) scale(1.2)">
                        <path d="M0 -30 L5 -15 L15 -25 L10 -10 L25 -10 L12 0 L25 10 L10 10 L15 25 L5 15 L0 30 L-5 15 L-15 25 L-10 10 L-25 10 L-12 0 L-25 -10 L-10 -10 L-15 -25 L-5 -15 Z" fill="none" stroke="#7c3aed" strokeWidth="3" />
                        <path d="M-15 5 L-5 -10 L0 -5 L5 -10 L15 5" fill="none" stroke="#a78bfa" strokeWidth="3" />
                        <circle cx="0" cy="0" r="4" fill="#a78bfa" />
                        <path d="M0 -40 L0 -32 M 35 -20 L 28 -16 M 35 20 L 28 16 M 0 40 L 0 32 M -35 20 L -28 16 M -35 -20 L -28 -16" stroke="#5b21b6" strokeWidth="4" strokeLinecap="round" />
                    </g>

                    {/* TKTHive Logo */}
                    <image href="/logo/whitelogo.png" x="0" y="0" height="48" width="120" opacity="1" transform="translate(770, 210) rotate(-90)" />


                    <text x="155" y="45" fill="white" fontSize="16" fontWeight="700" className="font-main">IIT TIRUPATI’S</text>

                    <text x="150" y="95" fill="url(#textGradient)" fontSize="64" fontWeight="800" className="font-main" letterSpacing="-1">E-SUMMIT’26</text>

                    <text x="155" y="120" fill="#d8b4fe" fontSize="18" fontWeight="400" className="font-main">Architecting Impact</text>

                    <text x="150" y="170" fill="white" fontSize="42" fontWeight="800" className="font-main">GENERAL PASS</text>

                    <text x="150" y="215" fill="#d8b4fe" fontSize="22" className="font-main">Name :</text>
                    <text x="235" y="215" fill="white" fontSize="22" fontWeight="600" className="font-main">{attendeeName}</text>
                    <line x1="230" y1="218" x2="620" y2="218" stroke="#d8b4fe" strokeWidth="2" />

                    <text x="150" y="250" fill="#d8b4fe" fontSize="22" className="font-main">College/Organisation :</text>
                    <text x="400" y="250" fill="white" fontSize="20" fontWeight="600" className="font-main">{collegeName}</text>
                    <line x1="390" y1="253" x2="620" y2="253" stroke="#d8b4fe" strokeWidth="2" />


                    <text x="0" y="0" transform="translate(845, 270) rotate(-90)" fill="white" fontSize="20" fontWeight="700" className="font-main">
                        JAN 31<tspan baselineShift="super" fontSize="14">st</tspan> &amp; FEB 1<tspan baselineShift="super" fontSize="14">st</tspan>, 2026
                    </text>

                    <g transform="translate(875, 60)">
                        <rect x="0" y="0" width="60" height="2" fill="white" />
                        <rect x="0" y="4" width="60" height="4" fill="white" />
                        <rect x="0" y="10" width="60" height="1" fill="white" />
                        <rect x="0" y="13" width="60" height="3" fill="white" />
                        <rect x="0" y="18" width="60" height="2" fill="white" />
                        <rect x="0" y="22" width="60" height="5" fill="white" />
                        <rect x="0" y="29" width="60" height="1" fill="white" />
                        <rect x="0" y="32" width="60" height="2" fill="white" />
                        <rect x="0" y="36" width="60" height="3" fill="white" />
                        <rect x="0" y="41" width="60" height="1" fill="white" />
                        <rect x="0" y="44" width="60" height="4" fill="white" />
                        <rect x="0" y="50" width="60" height="2" fill="white" />
                        <rect x="0" y="54" width="60" height="2" fill="white" />
                        <rect x="0" y="58" width="60" height="1" fill="white" />
                        <rect x="0" y="61" width="60" height="3" fill="white" />
                        <rect x="0" y="66" width="60" height="2" fill="white" />
                        <rect x="0" y="70" width="60" height="4" fill="white" />
                        <rect x="0" y="76" width="60" height="1" fill="white" />
                        <rect x="0" y="79" width="60" height="2" fill="white" />
                        <rect x="0" y="83" width="60" height="3" fill="white" />
                        <rect x="0" y="88" width="60" height="1" fill="white" />
                        <rect x="0" y="91" width="60" height="4" fill="white" />
                        <rect x="0" y="97" width="60" height="2" fill="white" />
                        <rect x="0" y="101" width="60" height="2" fill="white" />
                        <rect x="0" y="105" width="60" height="1" fill="white" />
                        <rect x="0" y="108" width="60" height="3" fill="white" />
                        <rect x="0" y="113" width="60" height="2" fill="white" />
                        <rect x="0" y="117" width="60" height="4" fill="white" />
                        <rect x="0" y="123" width="60" height="1" fill="white" />
                        <rect x="0" y="126" width="60" height="2" fill="white" />
                        <rect x="0" y="130" width="60" height="3" fill="white" />
                        <rect x="0" y="135" width="60" height="1" fill="white" />
                        <rect x="0" y="138" width="60" height="4" fill="white" />
                        <rect x="0" y="144" width="60" height="2" fill="white" />
                        <rect x="0" y="148" width="60" height="2" fill="white" />
                        <rect x="0" y="152" width="60" height="1" fill="white" />
                        <rect x="0" y="155" width="60" height="3" fill="white" />
                        <rect x="0" y="160" width="60" height="2" fill="white" />
                        <rect x="0" y="164" width="60" height="4" fill="white" />
                        <rect x="0" y="170" width="60" height="1" fill="white" />
                        <rect x="0" y="173" width="60" height="2" fill="white" />
                        <rect x="0" y="177" width="60" height="3" fill="white" />
                    </g>

                    <text x="0" y="0" transform="translate(945, 210) rotate(-90)" fill="white" fontSize="10" letterSpacing="3" className="font-main">{ticket.id.slice(-13)}</text>
                </svg>
            </div>
        </div>
    );
};

export default ESummitTicket;
