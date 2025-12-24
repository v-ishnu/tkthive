import React, { useState, useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { MOCK_EVENTS } from '../../constants';
import { HeroCards } from './HeroCards';

export default function Hero() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHoveringHero, setIsHoveringHero] = useState(false);

  // Global Mouse Move for Spotlight
  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHoveringHero(true)}
      onMouseLeave={() => setIsHoveringHero(false)}
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-zinc-950 text-white selection:bg-amber-400 selection:text-black group/hero"
    >
      {/* 1. Dark Event Background with Top/Bottom Fade */}
      <div
        className="absolute inset-0 z-0 opacity-10 mix-blend-overlay transition-transform duration-700 ease-out scale-105 group-hover/hero:scale-100"
        style={{
          // Dark concert crowd
          backgroundImage: `url('https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?q=80&w=1974&auto=format&fit=crop')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          // Fade from top (transparent) to visible (black) to bottom (transparent)
          maskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)'
        }}
      />

      {/* 2. Gradient Overlay for Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-zinc-950/40 z-0" />

      {/* 4. Dynamic Spotlight */}
      <div
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300 mix-blend-soft-light"
        style={{
          background: `radial-gradient(800px circle at ${mousePos.x}px ${mousePos.y}px, rgba(251, 191, 36, 0.25), transparent 80%)`
        }}
      />

      {/* Marquee Background */}
      <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full overflow-hidden pointer-events-none z-0 opacity-5 select-none rotate-[-5deg]">
        <div className="animate-marquee-infinite whitespace-nowrap flex items-center gap-10">
          <span className="text-[8rem] md:text-[12rem] font-black text-transparent uppercase leading-none" style={{ WebkitTextStroke: '2px rgba(255,255,255,0.5)' }}>
            LIVE EVENTS • CONCERTS • FESTIVALS • NIGHTLIFE •
          </span>
          <span className="text-[8rem] md:text-[12rem] font-black text-transparent uppercase leading-none" style={{ WebkitTextStroke: '2px rgba(255,255,255,0.5)' }}>
            LIVE EVENTS • CONCERTS • FESTIVALS • NIGHTLIFE •
          </span>
          <span className="text-[8rem] md:text-[12rem] font-black text-transparent uppercase leading-none" style={{ WebkitTextStroke: '2px rgba(255,255,255,0.5)' }}>
            LIVE EVENTS • CONCERTS • FESTIVALS • NIGHTLIFE •
          </span>
          <span className="text-[8rem] md:text-[12rem] font-black text-transparent uppercase leading-none" style={{ WebkitTextStroke: '2px rgba(255,255,255,0.5)' }}>
            LIVE EVENTS • CONCERTS • FESTIVALS • NIGHTLIFE •
          </span>
        </div>
      </div>

      {/* --- Main Content Container --- */}
      <div className="container mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">

        {/* LEFT: Kinetic Typography */}
        <div className="flex flex-col gap-4 md:gap-6 relative z-20">
          {/* Tagline */}
          <div className="flex items-center gap-3 animate-fade-in-up md:justify-start justify-center">
            <span className="w-8 md:w-12 h-[1px] bg-amber-400"></span>
            <span className="text-amber-400 font-bold tracking-widest text-xs md:text-sm uppercase">Next Gen Booking</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-black leading-[0.9] tracking-tight group md:text-left text-center">
            <span className="block transition-transform duration-500 hover:translate-x-4">CRAFT</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 to-zinc-600 transition-transform duration-500 hover:translate-x-4 delay-[50ms]">YOUR</span>
            <span className="block text-amber-400 transition-transform duration-500 hover:translate-x-4 delay-[100ms] relative">
              STORY
              {/* Decorative underline */}
              <svg className="absolute -bottom-2 md:-bottom-4 left-0 w-full h-2 md:h-4 text-amber-400/20" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="none" />
              </svg>
            </span>
          </h1>

          <p className="text-zinc-400 text-base md:text-xl max-w-lg leading-relaxed mt-2 md:mt-4 md:text-left text-center mx-auto md:mx-0">
            Unlock exclusive access to the city's most vibrant events. From underground gigs to massive festivals, your next chapter starts here.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-6 md:justify-start justify-center">
            <button className="px-6 py-3 md:px-8 md:py-4 bg-amber-400 hover:bg-amber-300 text-black font-bold text-base md:text-lg rounded-full transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(251,191,36,0.4)] flex items-center gap-2">
              Browse Tickets
              <ArrowUpRight size={20} />
            </button>
            <div className="flex items-center gap-4 text-zinc-500 font-medium text-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
              <span>Selling Fast</span>
            </div>
          </div>
        </div>

        {/* RIGHT: Vertical Scroll Cards */}
        <div className="relative flex justify-center lg:justify-end">
          <HeroCards />
        </div>

      </div>
    </div>
  );
}