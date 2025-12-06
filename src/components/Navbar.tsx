
import React, { useState } from 'react';
import { MapPin, Search, User, Menu, LogOut, Ticket, X, Home, Calendar, Info } from 'lucide-react';
import { LocationData, User as UserType } from '../types';
import { LocationModal } from './LocationModel';
import Link from 'next/link';



export const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
    const [location, setLocation] = useState<LocationData>({ city: 'Mumbai', country: 'India' });
    const [user, setUser] = useState<UserType | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);


    const handleLogout = () => {
        setUser(null);
    };

    const handleSearch = async (query: string) => {
        setLoading(true);
        setSearchQuery(query);

        try {


        } catch (error) {
            console.error("Failed to fetch events:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLocationSelect = (newLocation: LocationData) => {
        setLocation(newLocation);
        setIsLocationModalOpen(false);
        handleSearch(searchQuery || 'Popular events');
    };

    return (
        <>
            <nav className="fixed top-0 w-full z-50 bg-dark/90 backdrop-blur-xl border-b border-white/5">
                <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                    {/* Logo */}
                    <div
                      
                        className="flex items-center gap-3 group cursor-pointer"
                    >
                        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
                            <div className="w-4 h-4 bg-black rounded-full" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-white group-hover:text-primary transition-colors">LOGO</span>
                    </div>

                    {/* Center Links (Desktop) */}
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
                        <Link href='/' className="text-white hover:text-primary transition-colors">Home</Link>
                        <Link href='/events' className="hover:text-primary transition-colors">Events</Link>
                        <Link href='/about' className="hover:text-primary transition-colors">About Us</Link>
                        <Link href='/support' className="hover:text-primary transition-colors">Support</Link>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-4">
                        <div
                            onClick={() => setIsLocationModalOpen(true)}
                            className="hidden sm:flex items-center gap-2 cursor-pointer border border-white/10 bg-white/5 hover:bg-white/10 hover:border-primary/50 rounded-full pl-2 pr-4 py-1.5 transition-all group"
                        >
                            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                                <MapPin size={12} className="text-primary" />
                            </div>
                            <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">{location.city}</span>
                        </div>

                        <div className="h-6 w-px bg-white/10 hidden sm:block" />

                        {user ? (
                            <div className="flex items-center gap-3">
                                {/* My Tickets Button - Desktop */}
                                <Link href='/tickets'
                                   
                                    className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 hover:border-primary/30 transition-all text-sm font-medium text-gray-300 hover:text-white group"
                                >
                                    <Ticket size={16} className="text-primary group-hover:scale-110 transition-transform" />
                                    <span>My Tickets</span>
                                </Link>

                                <div className="relative group hidden md:block">
                                    <Link href='/profile'
                                      
                                        className="flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-full hover:bg-white/5 border border-transparent hover:border-white/10 transition-all"
                                    >
                                        <img src={user.avatar} alt="User" className="w-8 h-8 rounded-full border border-white/20" />
                                        <span className="text-sm font-bold text-white hidden sm:block">{user.name.split(' ')[0]}</span>
                                    </Link>

                                    {/* Dropdown */}
                                    <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-white/10 rounded-xl shadow-2xl p-2 hidden group-hover:block hover:block">
                                        <button
                                            
                                            className="w-full text-left px-4 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/5 flex items-center gap-2"
                                        >
                                            <User size={16} /> My Profile
                                        </button>
                                        <div className="h-px bg-white/10 my-1" />
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2"
                                        >
                                            <LogOut size={16} /> Log Out
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="hidden md:flex gap-2">
                                <Link href='/auth'
                                   
                                    className="text-sm font-medium text-white hover:text-primary transition-colors px-4 py-2"
                                >
                                    Log In
                                </Link>

                                <Link href='/auth'
                                    
                                    className="px-6 py-2.5 rounded-full bg-primary text-black text-sm font-bold hover:bg-primary-hover hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,214,10,0.3)]"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}

                        <button
                            className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
                            onClick={() => setIsMenuOpen(true)}
                        >
                            <Menu size={24} />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <div className={`fixed inset-0 z-[60] bg-dark/95 backdrop-blur-xl transition-transform duration-300 md:hidden ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex flex-col h-full p-6">
                    <div className="flex justify-between items-center mb-8">
                        <span className="text-2xl font-bold text-white">Menu</span>
                        <button onClick={() => setIsMenuOpen(false)} className="p-2 bg-white/5 rounded-full text-white hover:bg-white/10">
                            <X size={24} />
                        </button>
                    </div>

                    {user && (
                        <div className="flex items-center gap-4 mb-8 p-4 bg-white/5 rounded-2xl border border-white/5">
                            <img src={user.avatar} alt="User" className="w-12 h-12 rounded-full border border-white/10" />
                            <div>
                                <div className="font-bold text-white text-lg">{user.name}</div>
                                <div className="text-xs text-gray-400">{user.email}</div>
                            </div>
                        </div>
                    )}

                    <div className="space-y-2 flex-1 overflow-y-auto">
                        <Link href='/' className="w-full p-4 rounded-xl text-left text-lg font-medium hover:bg-white/5 text-white flex items-center gap-4">
                            <Home size={20} className="text-primary" /> Home
                        </Link>
                        <Link href='/events' className="w-full p-4 rounded-xl text-left text-lg font-medium hover:bg-white/5 text-white flex items-center gap-4">
                            <Calendar size={20} className="text-primary" /> Explore Events
                        </Link>
                        {user && (
                            <>
                                <Link href='/tickets' className="w-full p-4 rounded-xl text-left text-lg font-medium hover:bg-white/5 text-white flex items-center gap-4">
                                    <Ticket size={20} className="text-primary" /> My Tickets
                                </Link>
                                <Link href='/profile' className="w-full p-4 rounded-xl text-left text-lg font-medium hover:bg-white/5 text-white flex items-center gap-4">
                                    <User size={20} className="text-primary" /> Profile
                                </Link>
                            </>
                        )}
                        <Link href='/about' className="w-full p-4 rounded-xl text-left text-lg font-medium hover:bg-white/5 text-white flex items-center gap-4">
                            <Info size={20} className="text-primary" /> About Us
                        </Link>
                    </div>

                    <div className="mt-auto pt-6 border-t border-white/10 space-y-4">
                        <button
                            onClick={() => setIsLocationModalOpen(true)}
                            className="w-full p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-white font-medium"
                        >
                            <span className="flex items-center gap-2"><MapPin size={18} className="text-primary" /> {location.city}</span>
                            <span className="text-xs text-gray-400">Change</span>
                        </button>

                        {user ? (
                            <button
                                onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                                className="w-full p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 font-bold flex items-center justify-center gap-2"
                            >
                                <LogOut size={18} /> Log Out
                            </button>
                        ) : (
                            <div className="grid grid-cols-2 gap-4">
                                <Link href='/auth'
                                    
                                    className="p-4 rounded-xl bg-white/5 text-white font-bold text-center"
                                >
                                    Log In
                                </Link>
                                <Link href='/auth'
                                   
                                    className="p-4 rounded-xl bg-primary text-black font-bold text-center"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <LocationModal
                isOpen={isLocationModalOpen}
                onClose={() => setIsLocationModalOpen(false)}
                onSelect={handleLocationSelect}
            />
        </>
    );
};