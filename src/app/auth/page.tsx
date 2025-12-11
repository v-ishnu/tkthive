"use client";
import React, { useState } from 'react';
import { ArrowLeft, Mail, Lock, User, PartyPopper, Phone, AlertCircle } from 'lucide-react';
import { User as UserType } from '@/types';
import { useRouter } from 'next/navigation';




const EVENT_IMAGES_COL_1 = [
    "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=400&auto=format&fit=crop", // Concert
    "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=400&auto=format&fit=crop", // Gaming
    "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=400&auto=format&fit=crop", // Conference
    "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=400&auto=format&fit=crop", // Party
];

const EVENT_IMAGES_COL_2 = [
    "https://images.unsplash.com/photo-1552674605-4696c2458404?q=80&w=400&auto=format&fit=crop", // Sports
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=400&auto=format&fit=crop", // Crowd
    "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?q=80&w=400&auto=format&fit=crop", // Jazz
    "https://images.unsplash.com/photo-1533174072545-e8d4aa97edf9?q=80&w=400&auto=format&fit=crop", // Lighting
];

const EVENT_IMAGES_COL_3 = [
    "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=400&auto=format&fit=crop", // Gaming 2
    "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=400&auto=format&fit=crop", // Rock
    "https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=400&auto=format&fit=crop", // Talk
    "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=400&auto=format&fit=crop", // Festival
];

export default function AuthPage() {
    const router = useRouter();
    const [mode, setMode] = useState<'login' | 'signup'>('login');
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            setLoading(false);

            if (mode === 'login') {
                if (email === 'user@gmail.com' && password === '123') {
                    const mockUser: UserType = {
                        name: "Demo User",
                        email: "user@gmail.com",
                        avatar: "https://i.pravatar.cc/150?u=user@gmail.com",
                        phone: "+91 98765 43210",
                        tickets: [
                            {
                                id: "tkt_001",
                                eventId: "1",
                                eventTitle: "Sunburn Arena ft. DJ Snake",
                                eventDate: "Fri, Nov 24, 2025, 20:00",
                                eventVenue: "Jio World Garden, Mumbai",
                                eventImage: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070&auto=format&fit=crop",
                                ticketType: "General Admission",
                                price: "₹2,499",
                                bookingDate: "2024-10-15",
                                attendees: 1
                            },
                            {
                                id: "tkt_002",
                                eventId: "4",
                                eventTitle: "Bengaluru Tech Summit",
                                eventDate: "Sun, Nov 29, 2024, 10:00", // Past date
                                eventVenue: "Bangalore Palace, Bengaluru",
                                eventImage: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=2070&auto=format&fit=crop",
                                ticketType: "Free Pass",
                                price: "Free",
                                bookingDate: "2024-09-01",
                                attendees: 1
                            }
                        ]
                    };
                    localStorage.setItem('user_data', JSON.stringify(mockUser));
                    // Trigger a storage event manually to help hydration if needed, but the reload/redirect handles it
                    window.dispatchEvent(new Event("storage"));
                    router.push('/');
                } else {
                    setError("Invalid credentials. Try user@gmail.com / 123");
                }
            } else {
                // Mock signup logic
                const mockUser: UserType = {
                    name: "New User",
                    email: email,
                    avatar: `https://i.pravatar.cc/150?u=${email}`,
                    tickets: []
                };
                localStorage.setItem('user_data', JSON.stringify(mockUser));
                window.dispatchEvent(new Event("storage"));
                router.push('/');
            }
        }, 1500);
    };

    return (
        <div className="min-h-screen w-full flex bg-dark">
            <style>{`
        @keyframes scroll-up {
            0% { transform: translateY(0); }
            100% { transform: translateY(-50%); }
        }
        @keyframes scroll-down {
            0% { transform: translateY(-50%); }
            100% { transform: translateY(0); }
        }
        .animate-scroll-up {
            animation: scroll-up 40s linear infinite;
        }
        .animate-scroll-down {
            animation: scroll-down 45s linear infinite;
        }
      `}</style>

            {/* Back Button */}
            <button
                onClick={() => router.back()}
                className="absolute top-6 left-6 z-50 p-2 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-black/60 transition-colors border border-white/10"
            >
                <ArrowLeft size={20} />
            </button>

            {/* Left Side - Animated Banner (Sticky on Desktop) */}
            <div className="hidden md:flex w-1/2 h-screen sticky top-0 relative overflow-hidden bg-[#050505] items-center justify-center text-center border-r border-white/5">

                {/* Animated Scrolling Grid */}
                <div className="absolute inset-0 flex gap-4 p-4 opacity-40 -skew-x-6 scale-110 transform origin-center">
                    {/* Column 1 - Scroll Up */}
                    <div className="flex-1 space-y-4 animate-scroll-up">
                        {[...EVENT_IMAGES_COL_1, ...EVENT_IMAGES_COL_1, ...EVENT_IMAGES_COL_1].map((img, i) => (
                            <div key={i} className="rounded-2xl overflow-hidden aspect-[3/4]">
                                <img src={img} alt="" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                            </div>
                        ))}
                    </div>

                    {/* Column 2 - Scroll Down */}
                    <div className="flex-1 space-y-4 animate-scroll-down">
                        {[...EVENT_IMAGES_COL_2, ...EVENT_IMAGES_COL_2, ...EVENT_IMAGES_COL_2].map((img, i) => (
                            <div key={i} className="rounded-2xl overflow-hidden aspect-[3/4]">
                                <img src={img} alt="" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                            </div>
                        ))}
                    </div>

                    {/* Column 3 - Scroll Up */}
                    <div className="flex-1 space-y-4 animate-scroll-up">
                        {[...EVENT_IMAGES_COL_3, ...EVENT_IMAGES_COL_3, ...EVENT_IMAGES_COL_3].map((img, i) => (
                            <div key={i} className="rounded-2xl overflow-hidden aspect-[3/4]">
                                <img src={img} alt="" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Gradient Overlay for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/85 to-[#050505]/60 z-10" />
                <div className="absolute inset-0 bg-black/20 z-10 backdrop-blur-[2px]" />

                <div className="relative z-20 space-y-8 max-w-lg p-12">
                    <div className="w-24 h-24 bg-primary rounded-3xl mx-auto flex items-center justify-center rotate-12 shadow-[0_0_50px_rgba(255,214,10,0.4)] mb-10 transition-transform hover:rotate-6 duration-500">
                        <PartyPopper size={48} className="text-black" />
                    </div>

                    <h2 className="text-5xl font-bold text-white tracking-tight drop-shadow-2xl">
                        {mode === 'login' ? 'Welcome Back!' : 'Join the Hive!'}
                    </h2>

                    <p className="text-gray-300 text-xl leading-relaxed drop-shadow-md">
                        {mode === 'login'
                            ? 'Skip the FOMO. Log in to access your tickets, saved events, and exclusive community perks.'
                            : 'Create an account to start booking the best concerts, workshops, and tournaments near you.'}
                    </p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full md:w-1/2 bg-card min-h-screen flex flex-col justify-center p-8 md:p-20 relative">
                <div className="max-w-md mx-auto w-full space-y-10">
                    <div className="text-center md:text-left">
                        <h3 className="text-3xl font-bold text-white mb-3">
                            {mode === 'login' ? 'Login to your account' : 'Create new account'}
                        </h3>
                        <p className="text-gray-400">
                            {mode === 'login' ? 'Enter your details below' : "It's free and takes less than a minute"}
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3 text-red-400 text-sm">
                            <AlertCircle size={18} />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {mode === 'signup' && (
                            <>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Full Name</label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors" size={20} />
                                        <input
                                            type="text"
                                            required
                                            placeholder="John Doe"
                                            className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:border-primary/50 outline-none transition-all placeholder:text-gray-600"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Phone Number</label>
                                    <div className="relative group">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors" size={20} />
                                        <input
                                            type="tel"
                                            required
                                            placeholder="+91 98765 43210"
                                            className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:border-primary/50 outline-none transition-all placeholder:text-gray-600"
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors" size={20} />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@example.com"
                                    className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:border-primary/50 outline-none transition-all placeholder:text-gray-600"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors" size={20} />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:border-primary/50 outline-none transition-all placeholder:text-gray-600"
                                />
                            </div>
                        </div>

                        {mode === 'login' && (
                            <div className="flex justify-end">
                                <button type="button" className="text-sm text-primary hover:text-white transition-colors">
                                    Forgot password?
                                </button>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary hover:bg-primary-hover text-black font-bold py-4 rounded-xl transition-all shadow-lg shadow-primary/20 mt-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
                        >
                            {loading ? 'Processing...' : (mode === 'login' ? 'Login Now' : 'Create Account')}
                        </button>
                    </form>

                    <div className="relative py-4">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase tracking-widest">
                            <span className="bg-card px-4 text-gray-500">Or continue with</span>
                        </div>
                    </div>

                    <button className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-3">
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        {mode === 'login' ? 'Login with Google' : 'Sign up with Google'}
                    </button>

                    <p className="text-center text-gray-400">
                        {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
                        <button
                            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                            className="text-white font-bold hover:text-primary transition-colors ml-1"
                        >
                            {mode === 'login' ? 'Create a new account now' : 'Login here'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};
