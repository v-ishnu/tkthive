import React from 'react';

interface AdProps {
  title: string;
  description: string;
  cta: string;
  align?: 'left' | 'right';
  isGaming?: boolean;
}

interface AdSectionProps extends AdProps {
  secondaryAd?: AdProps;
}

const SingleAdBlock: React.FC<AdProps & { fullWidth?: boolean }> = ({
  title, description, cta, align = 'left', isGaming = false, fullWidth = false
}) => {
  const bgImage = isGaming
    ? "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop"
    : "https://images.unsplash.com/photo-1459749411177-d2841fbd74e0?q=80&w=2070&auto=format&fit=crop";

  return (
    <div className="relative overflow-hidden h-full min-h-[300px] flex items-center border border-white/5 group bg-zinc-900 rounded-3xl">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={bgImage}
          alt="Ad Background"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-60"
        />
        <div className={`absolute inset-0 bg-gradient-to-r ${align === 'left' ? 'from-black via-black/80 to-transparent' : 'from-transparent via-black/80 to-black'}`} />
      </div>

      <div className={`relative z-10 p-6 md:p-12 w-full ${fullWidth ? 'md:w-1/2' : ''} flex flex-col ${align === 'right' ? 'md:ml-auto md:items-end md:text-right' : 'items-start text-left'}`}>
        <span className="text-primary font-bold tracking-widest text-xs mb-2 uppercase border border-primary/20 bg-primary/10 px-2 py-1 rounded">Sponsored</span>
        <h2 className="text-2xl md:text-4xl font-black text-white mb-4 leading-tight">{title}</h2>
        <p className="text-text-secondary text-sm md:text-base mb-8 max-w-sm font-medium leading-relaxed">{description}</p>

        <button className="px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-primary transition-colors duration-300 flex items-center gap-2 shadow-lg hover:shadow-primary/20">
          {cta}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
        </button>
      </div>
    </div>
  );
};

export const AdSection: React.FC<AdSectionProps> = (props) => {
  const { secondaryAd } = props;

  if (secondaryAd) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
        <SingleAdBlock {...props} fullWidth={false} />
        <SingleAdBlock {...secondaryAd} fullWidth={false} />
      </div>
    );
  }

  return (
    <SingleAdBlock {...props} fullWidth={true} />
  );
};