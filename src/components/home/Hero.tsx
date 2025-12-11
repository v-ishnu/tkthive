import React, { useState, useEffect, useRef } from 'react';
import { Search, Calendar, ChevronDown, Clock, ArrowRight } from 'lucide-react';
import { MOCK_EVENTS } from '../../constants';
import { HivePattern } from '../HivePattern';

interface HeroProps {
  onSearch: (query: string) => void;
  currentLocation: string;
}

const SCRAMBLE_WORDS = [
  "Tech Hackathons",
  "DJ Nights",
  "Online Workshops",
  "Live Concerts",
  "Gaming Tournaments",
  "Art Exhibitions"
];

const SCRAMBLE_CHARS = "!<-_/]{—=+?A_T_S_D_F_E_G_H_J_K_L_I_V_";

export default function Hero() {
  const [query, setQuery] = useState('');

  // Scramble State
  const [text, setText] = useState(SCRAMBLE_WORDS[0]);
  const [wordIndex, setWordIndex] = useState(0);

  // Carousel State
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [scrollY, setScrollY] = useState(0);

  // Liquid Effect Refs
  const filterRef = useRef<SVGFETurbulenceElement>(null);

  // Get upcoming events for the top carousel
  const upcomingEvents = MOCK_EVENTS.filter(e => !e.isLive && !e.venue.includes('Online')).slice(0, 3);

  // Scroll Listener for Parallax Bees
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cyber Decode / Scramble Effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    const targetWord = SCRAMBLE_WORDS[wordIndex % SCRAMBLE_WORDS.length];
    let iteration = 0;

    clearInterval(interval!);

    interval = setInterval(() => {
      setText(prev =>
        targetWord
          .split("")
          .map((letter, index) => {
            if (index < iteration) {
              return targetWord[index];
            }
            return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
          })
          .join("")
      );

      if (iteration >= targetWord.length) {
        clearInterval(interval);
        // Wait before starting next word
        setTimeout(() => {
          setWordIndex(prev => prev + 1);
        }, 3000);
      }

      iteration += 1 / 3; // Decode speed (lower is slower)
    }, 30); // Scramble speed

    return () => clearInterval(interval);
  }, [wordIndex]);

  // Carousel Rotation Logic
  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false); // Start fade out
      setTimeout(() => {
        setCurrentEventIndex((prev) => (prev + 1) % upcomingEvents.length);
        setFade(true); // Start fade in
      }, 500); // Wait for fade out animation
    }, 6000); // Switch every 6 seconds
    return () => clearInterval(interval);
  }, [upcomingEvents.length]);

  // Countdown Logic
  useEffect(() => {
    const currentEvent = upcomingEvents[currentEventIndex];
    if (!currentEvent) return;

    let targetDate = new Date();
    try {
      // Mock parsing for demo data
      const dateStr = currentEvent.date.replace(' at ', ' ');
      targetDate = new Date(dateStr);
      if (isNaN(targetDate.getTime())) {
        const now = new Date();
        targetDate = new Date(now.getTime() + ((currentEventIndex + 1) * 24 * 60 * 60 * 1000) + (5 * 60 * 60 * 1000));
      }
    } catch (e) {
      targetDate = new Date();
    }

    const timer = setInterval(() => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [currentEventIndex, upcomingEvents]);

  // Liquid Mouse Interaction
  const handleMouseMove = (e: React.MouseEvent) => {
    if (filterRef.current) {
      // Calculate frequency based on mouse position to create distortion
      const freqX = 0.005 + (e.clientX / window.innerWidth) * 0.01;
      const freqY = 0.005 + (e.clientY / window.innerHeight) * 0.01;
      filterRef.current.setAttribute('baseFrequency', `${freqX} ${freqY}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {

      const section = document.getElementById('events-section');
      if (section) section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const currentEvent = upcomingEvents[currentEventIndex];

  return (
    <div
      className="relative min-h-[500px] md:min-h-[650px] flex items-center justify-center overflow-hidden group cursor-bee"
      onMouseMove={handleMouseMove}
    >
      {/* SVG Filter Definition */}
      <svg className="hidden">
        <defs>
          <filter id="liquid-distortion">
            <feTurbulence
              ref={filterRef}
              type="fractalNoise"
              baseFrequency="0.01 0.01"
              numOctaves="2"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="30"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* Dynamic Background with Liquid Filter */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center bg-no-repeat transform scale-105 transition-all duration-100 ease-out"
          style={{ filter: 'url(#liquid-distortion)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/90 to-dark/40 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-dark/50 to-transparent pointer-events-none" />
      </div>

      {/* HIVE PATTERN OVERLAY */}
      <HivePattern className="z-0 opacity-20" />

      {/* Parallax Bees */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        {/* Bee 1 - Top Left */}
        <div
          className="absolute top-[20%] left-[10%] w-8 h-8 opacity-60 transition-transform duration-100 ease-out"
          style={{ transform: `translateY(${scrollY * 0.2}px) rotate(15deg)` }}
        >
          <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='none'%3E%3Cpath d='M8 12a4 4 0 1 1 8 0 4 4 0 0 1-8 0z' fill='%23FFD60A' stroke='black' stroke-width='1.5'/%3E%3Cpath d='M8 12h8' stroke='black' stroke-width='1.5'/%3E%3Cpath d='M12 8v8' stroke='black' stroke-width='1.5'/%3E%3Cpath d='M6 8c-2-3-1-6 2-6 2 0 3 2 4 4' stroke='white' stroke-width='1.5' stroke-linecap='round'/%3E%3Cpath d='M18 8c2-3 1-6-2-6-2 0-3 2-4 4' stroke='white' stroke-width='1.5' stroke-linecap='round'/%3E%3Cpath d='M12 16v3' stroke='black' stroke-width='1.5'/%3E%3C/svg%3E" alt="bee" />
        </div>

        {/* Bee 2 - Bottom Right */}
        <div
          className="absolute top-[60%] right-[15%] w-6 h-6 opacity-40 transition-transform duration-100 ease-out"
          style={{ transform: `translateY(${scrollY * -0.15}px) rotate(-10deg)` }}
        >
          <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='none'%3E%3Cpath d='M8 12a4 4 0 1 1 8 0 4 4 0 0 1-8 0z' fill='%23FFD60A' stroke='black' stroke-width='1.5'/%3E%3Cpath d='M8 12h8' stroke='black' stroke-width='1.5'/%3E%3Cpath d='M12 8v8' stroke='black' stroke-width='1.5'/%3E%3Cpath d='M6 8c-2-3-1-6 2-6 2 0 3 2 4 4' stroke='white' stroke-width='1.5' stroke-linecap='round'/%3E%3Cpath d='M18 8c2-3 1-6-2-6-2 0-3 2-4 4' stroke='white' stroke-width='1.5' stroke-linecap='round'/%3E%3Cpath d='M12 16v3' stroke='black' stroke-width='1.5'/%3E%3C/svg%3E" alt="bee" />
        </div>

        {/* Bee 3 - Middle Center */}
        <div
          className="absolute top-[40%] left-[60%] w-4 h-4 opacity-30 blur-[1px] transition-transform duration-100 ease-out"
          style={{ transform: `translateY(${scrollY * 0.4}px) rotate(45deg)` }}
        >
          <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='none'%3E%3Cpath d='M8 12a4 4 0 1 1 8 0 4 4 0 0 1-8 0z' fill='%23FFD60A' stroke='black' stroke-width='1.5'/%3E%3Cpath d='M8 12h8' stroke='black' stroke-width='1.5'/%3E%3Cpath d='M12 8v8' stroke='black' stroke-width='1.5'/%3E%3Cpath d='M6 8c-2-3-1-6 2-6 2 0 3 2 4 4' stroke='white' stroke-width='1.5' stroke-linecap='round'/%3E%3Cpath d='M18 8c2-3 1-6-2-6-2 0-3 2-4 4' stroke='white' stroke-width='1.5' stroke-linecap='round'/%3E%3Cpath d='M12 16v3' stroke='black' stroke-width='1.5'/%3E%3C/svg%3E" alt="bee" />
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 pt-24 flex flex-col items-center text-center">

        {/* Dynamic Event Carousel Badge */}
        {currentEvent && (
          <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-700 w-full max-w-xl mx-auto">
            <div
              className="relative overflow-hidden bg-white/5 backdrop-blur-md border border-white/10 rounded-full p-1.5 pr-6 flex items-center gap-4 cursor-pointer hover:bg-white/10 transition-all group"

            >
              <div className="bg-primary text-black text-[10px] md:text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shrink-0 flex flex-col items-center min-w-[90px]">
                <span className="text-[8px] opacity-70">STARTS IN</span>
                <span className="font-mono leading-none">{timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m</span>
              </div>

              <div className={`flex-1 text-left overflow-hidden transition-all duration-500 transform ${fade ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
                <div className="text-white text-xs md:text-sm font-bold truncate">
                  {currentEvent.title}
                </div>
                <div className="text-gray-400 text-[10px] md:text-xs truncate flex items-center gap-2">
                  <Clock size={10} className="text-primary" />
                  {currentEvent.date.split(',')[0]} • {currentEvent.venue}
                </div>
              </div>
              <ArrowRight size={14} className="text-gray-400 group-hover:text-white transition-colors shrink-0" />
            </div>
          </div>
        )}

        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 tracking-tighter text-white drop-shadow-2xl h-[3.5em] md:h-[3em] flex flex-col items-center justify-center">
          <div>Discover & Book</div>
          <span className="text-primary relative inline-block mt-2 font-mono uppercase tracking-tight">
            {text}
          </span>
        </h1>

        <p className="text-gray-400 text-base md:text-xl max-w-2xl mb-12 leading-relaxed">
          The ultimate platform for finding events in ..... and beyond.
        </p>

        {/* Search Bar Container */}
        {/* <form onSubmit={handleSubmit} className="w-full max-w-4xl bg-card/60 backdrop-blur-xl border border-white/10 p-2 rounded-2xl flex flex-col md:flex-row gap-2 shadow-[0_0_50px_-12px_rgba(255,214,10,0.1)] transition-all focus-within:shadow-[0_0_50px_-12px_rgba(255,214,10,0.3)] focus-within:border-primary/30">
          
          <div className="flex-1 flex items-center px-4 md:px-6 h-12 md:h-14 md:border-r border-white/10">
            <Search className="text-primary mr-4" size={20} />
            <input 
              type="text" 
              placeholder="Search events, artists, or venues..." 
              className="bg-transparent w-full outline-none text-white text-base md:text-lg placeholder:text-gray-500 font-medium"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className="hidden md:flex items-center px-6 h-14 w-56 border-r border-white/10 cursor-pointer group hover:bg-white/5 transition-colors">
            <Calendar className="text-gray-500 mr-3 group-hover:text-primary transition-colors" size={20} />
            <span className="text-gray-300 text-sm font-medium group-hover:text-white">Any Date</span>
            <ChevronDown className="ml-auto text-gray-500" size={16} />
          </div>

          <button 
            type="submit"
            className="h-12 md:h-14 px-10 bg-primary hover:bg-primary-hover text-black font-bold text-lg rounded-xl transition-all active:scale-95 shadow-lg shadow-primary/20"
          >
            Search
          </button>
        </form> */}

        {/* Quick Tags */}
        {/* <div className="mt-10 flex flex-wrap justify-center gap-2 md:gap-3 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
            {['Music', 'Sports', 'Gaming', 'Art', 'Tech', 'Food'].map((tag) => (
                <button 
                    key={tag}
                  
                    className="px-4 py-1.5 md:px-5 md:py-2 rounded-full border border-white/10 hover:border-primary/50 bg-white/5 hover:bg-white/10 text-xs md:text-sm font-medium text-gray-400 hover:text-primary transition-all"
                >
                    {tag}
                </button>
            ))}
        </div> */}
      </div>

      {/* Bottom Marquee */}
      {/* <div className="absolute bottom-0 w-full border-t border-white/10 bg-black/20 backdrop-blur-sm overflow-hidden z-20">
        <div className="flex w-fit animate-marquee whitespace-nowrap py-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-12 px-6">
              {['LIVE CONCERTS', 'TECH HACKATHONS', 'ESPORTS TOURNAMENTS', 'ART EXHIBITIONS', 'STANDUP COMEDY', 'WORKSHOPS'].map((item) => (
                <div key={item} className="flex items-center gap-12">
                  <span className="text-xl md:text-2xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white/50 to-white/20 select-none hover:text-primary transition-colors cursor-default">
                    {item}
                  </span>
                  <span className="text-primary/50 text-xl">✦</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div> */}
    </div>
  );
};