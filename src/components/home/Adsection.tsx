import React from 'react';

interface AdSectionProps {
  title: string;
  description: string;
  cta: string;
  align?: 'left' | 'right';
  isGaming?: boolean;
}

export const AdSection: React.FC<AdSectionProps> = ({ 
  title, 
  description, 
  cta, 
  align = 'left',
  isGaming = false
}) => {
  const bgImage = isGaming 
    ? "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop"
    : "https://images.unsplash.com/photo-1459749411177-d2841fbd74e0?q=80&w=2070&auto=format&fit=crop";

  return (
    <div className="relative rounded-3xl overflow-hidden min-h-[300px] flex items-center border border-white/5 group">
      {/* Background */}
      <div className="absolute inset-0">
        <img 
            src={bgImage} 
            alt="Ad Background" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className={`absolute inset-0 bg-gradient-to-r ${align === 'left' ? 'from-dark via-dark/80 to-transparent' : 'from-transparent via-dark/80 to-dark'}`} />
        {/* Mobile Overlay */}
        <div className="absolute inset-0 bg-dark/60 md:hidden" />
      </div>

      <div className={`relative z-10 p-6 md:p-16 w-full md:w-1/2 flex flex-col ${align === 'right' ? 'md:ml-auto md:items-end md:text-right' : 'items-start text-left'}`}>
        <span className="text-primary font-bold tracking-widest text-sm mb-2 uppercase">Sponsored</span>
        <h2 className="text-2xl md:text-5xl font-bold text-white mb-4 leading-tight">{title}</h2>
        <p className="text-gray-300 text-base md:text-lg mb-8 max-w-md">{description}</p>
        
        <button className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-primary transition-colors duration-300 flex items-center gap-2">
            {cta}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
        </button>
      </div>
    </div>
  );
};