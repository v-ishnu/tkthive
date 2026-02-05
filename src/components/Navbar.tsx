"use client";
import React, { useState, useEffect } from 'react';
import { MapPin, Search, User, Menu, LogOut, Ticket, X, Home, Calendar, Info, ChevronDown, Cpu, Gamepad2, Music, Trophy, Palette, Bell, AlignRight, LayoutDashboard } from 'lucide-react';
import { LocationData, User as UserType } from '../types';
import { LocationModal } from './LocationModel';
import { NotificationPanel } from './NotificationPanel';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { logoutUser } from '@/store/slices/authslice';
import { fetchAllEvents } from '@/store/slices/eventSlice';
import { fetchNotifications } from '@/store/slices/notificationSlice';



export const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCatDropdownOpen, setIsCatDropdownOpen] = useState(false);
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [location, setLocation] = useState<LocationData | null>(null);
    const { user, isLoading: authLoading } = useAppSelector((state) => state.auth);
    const { unreadCount } = useAppSelector((state) => state.notification);
    const dispatch = useAppDispatch();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchLoading, setSearchLoading] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    React.useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const savedLocation = localStorage.getItem('user_location');
        if (savedLocation) {
            try {
                setLocation(JSON.parse(savedLocation));
            } catch (e) {
                console.error("Failed to parse location", e);
                setIsLocationModalOpen(true);
            }
        } else {
            setIsLocationModalOpen(true);
        }

        if (user) {
            dispatch(fetchNotifications());
        }
    }, [user, dispatch]);

    const handleLogout = async () => {
        await dispatch(logoutUser());
        router.push('/');
    };


    const handleSearch = async (query: string) => {
        setSearchLoading(true);
        setSearchQuery(query);

        try {


        } catch (error) {
            console.error("Failed to fetch events:", error);
        } finally {
            setSearchLoading(false);
        }
    };

    const handleLocationSelect = (newLocation: LocationData) => {
        setLocation(newLocation);
        localStorage.setItem('user_location', JSON.stringify(newLocation));
        setIsLocationModalOpen(false);
        // handleSearch(searchQuery || 'Popular events'); // Replaced with direct fetch
        dispatch(fetchAllEvents(newLocation.city));
    };

    return (
        <>
            <nav
                className={`fixed inset-x-0 top-0 w-full z-50 transition-all duration-300 ${isScrolled
                    ? 'bg-dark/90 backdrop-blur-xl border-b border-white/5 py-0'
                    : 'bg-transparent border-transparent py-4'
                    }`}
            >
                <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                    {/* Left Side: Logo & Navigation */}
                    <div className="flex items-center gap-8 lg:gap-12">
                        {/* tkthive */}
                        <Link href='/' className="flex items-center gap-3 group cursor-pointer">
                            <div className="flex items-center gap-3 group cursor-pointer">
                                <img src="/logo/whitelogo.png" alt="tkthive" className="h-10 w-auto object-contain group-hover:opacity-80 transition-opacity" />
                            </div>
                        </Link>

                        {/* Nav Links (Desktop) */}
                        <div className="hidden lg:flex items-center gap-6 lg:gap-8 text-sm font-medium text-text-secondary">
                            <Link href='/' className={`transition-colors ${pathname == '/' ? 'text-primary' : 'hover:text-primary'}`}>Home</Link>

                            <div className="relative group/cat">
                                <Link
                                    className={`flex items-center gap-1 hover:text-primary transition-colors ${pathname === '/events' ? 'text-primary' : ''}`}
                                    onMouseEnter={() => setIsCatDropdownOpen(true)}
                                    href='/events'
                                >
                                    Categories <ChevronDown size={14} />
                                </Link>

                                <div
                                    className="absolute top-full left-1/2 -translate-x-1/2 pt-4 hidden group-hover/cat:block hover:block"
                                >
                                    <div className="w-64 bg-card border border-white/10 rounded-xl shadow-2xl p-2 grid gap-1">
                                        {[
                                            { id: 'Tech', label: 'Tech & Coding', icon: Cpu },
                                            { id: 'Esports', label: 'Esports', icon: Gamepad2 },
                                            { id: 'Concert', label: 'Concerts', icon: Music },
                                            { id: 'Sports', label: 'Sports', icon: Trophy },
                                            { id: 'Art', label: 'Arts & Culture', icon: Palette },
                                        ].map((cat) => (
                                            <Link
                                                key={cat.id}
                                                href={`/events?category=${cat.id}`}
                                                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 text-left text-text-secondary hover:text-primary transition-all group/item"
                                            >
                                                <cat.icon size={16} className="text-text-muted group-hover/item:text-primary" />
                                                {cat.label}
                                            </Link>
                                        ))}
                                        <div className="h-px bg-white/5 my-1" />
                                        <Link href='/events' className="text-center py-2 text-xs font-bold uppercase tracking-wider text-text-muted hover:text-text-main">View All Events</Link>
                                    </div>
                                </div>
                            </div>

                            <Link href='/support' className={`${pathname === '/support' ? 'text-primary' : 'hover:text-primary transition-colors'}`}>Support</Link>
                        </div>
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
                            <span className="text-sm font-medium text-text-secondary group-hover:text-text-main">{location ? location.city : 'Select Location'}</span>
                        </div>

                        <div className="h-6 w-px bg-white/10 hidden sm:block" />

                        {authLoading ? (
                            <div className="hidden md:flex items-center gap-4 animate-pulse">
                                <div className="w-10 h-10 rounded-full bg-white/10"></div>
                                <div className="w-20 h-4 rounded bg-white/10"></div>
                            </div>
                        ) : user ? (
                            <div className="flex items-center gap-3">
                                {/* Dashboard Button - Organizer Only */}
                                {user.role === 'ORGANIZER' && (
                                    <Link href='/organizer/dashboard'
                                        className="hidden md:flex items-center gap-2 px-3 py-2 rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 hover:border-amber-500/50 transition-all text-sm font-bold text-amber-500 hover:text-amber-400 group"
                                    >
                                        <LayoutDashboard size={16} className="text-amber-500 group-hover:scale-110 transition-transform" />
                                        <span className="hidden xl:inline">Dashboard</span>
                                    </Link>
                                )}

                                {/* My Tickets Button - Desktop */}
                                <Link href='/mytickets'
                                    className="hidden md:flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 hover:border-primary/30 transition-all text-sm font-medium text-text-secondary hover:text-text-main group"
                                >
                                    <Ticket size={16} className="text-primary group-hover:scale-110 transition-transform" />
                                    <span className="hidden xl:inline">My Tickets</span>
                                </Link>

                                {/* Notification Bell */}
                                <button
                                    onClick={() => setIsNotificationOpen(true)}
                                    className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 hover:border-primary/30 transition-all text-text-secondary hover:text-text-main relative group"
                                >
                                    <Bell size={18} className="group-hover:text-primary transition-colors" />
                                    {/* Unread Badge */}
                                    {unreadCount > 0 && (
                                        <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-card"></span>
                                    )}
                                </button>

                                <div className="relative group hidden md:block">
                                    <Link href='/profile'
                                        className="flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-full hover:bg-white/5 border border-transparent hover:border-white/10 transition-all"
                                    >
                                        <img src={user.avatar || "/default-avatar.svg"} alt="User" className="w-8 h-8 rounded-full border border-white/20 object-cover" />
                                        <span className="text-sm font-bold text-text-main hidden xl:block">{user.name ? user.name.split(' ')[0] : 'User'}</span>
                                    </Link>

                                    {/* Dropdown */}
                                    <div className="absolute right-0 top-full pt-2 w-48 hidden group-hover:block hover:block">
                                        <div className="bg-card border border-white/10 rounded-xl shadow-2xl p-2">
                                            <Link
                                                href="/profile"
                                                className="w-full text-left px-4 py-2 rounded-lg text-sm text-text-secondary hover:text-text-main hover:bg-white/5 flex items-center gap-2"
                                            >
                                                <User size={16} /> My Profile
                                            </Link>
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
                            className="lg:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors group"
                            onClick={() => setIsMenuOpen(true)}
                        >
                            <AlignRight size={28} className="text-white group-hover:text-primary transition-colors" />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <div className={`fixed inset-0 z-[60] bg-dark/95 backdrop-blur-xl transition-transform duration-300 lg:hidden ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex flex-col h-full p-6">
                    <div className="flex justify-between items-center mb-8">
                        <span className="text-2xl font-bold text-white">Menu</span>
                        <button onClick={() => setIsMenuOpen(false)} className="p-2 bg-white/5 rounded-full text-white hover:bg-white/10">
                            <X size={24} />
                        </button>
                    </div>

                    {user && (
                        <div className="flex items-center gap-4 mb-8 p-4 bg-white/5 rounded-2xl border border-white/5">
                            <img src={user.avatar || "/default-avatar.svg"} alt="User" className="w-12 h-12 rounded-full border border-white/10 object-cover" />
                            <div>
                                <div className="font-bold text-white text-lg">{user.name}</div>
                                <div className="text-xs text-gray-400">{user.email}</div>
                            </div>
                        </div>
                    )}

                    <div className="space-y-2 flex-1 overflow-y-auto scrollbar-hide">
                        <Link href='/' onClick={() => setIsMenuOpen(false)} className="w-full p-4 rounded-xl text-left text-lg font-medium hover:bg-white/5 text-white flex items-center gap-4">
                            <Home size={20} className="text-primary" /> Home
                        </Link>
                        <Link href='/events' onClick={() => setIsMenuOpen(false)} className="w-full p-4 rounded-xl text-left text-lg font-medium hover:bg-white/5 text-white flex items-center gap-4">
                            <Calendar size={20} className="text-primary" /> Explore Events
                        </Link>
                        {user && (
                            <>
                                {user.role === 'ORGANIZER' && (
                                    <Link href='/organizer/dashboard' onClick={() => setIsMenuOpen(false)} className="w-full p-4 rounded-xl text-left text-lg font-medium hover:bg-amber-500/10 text-amber-500 flex items-center gap-4 border border-amber-500/20 mb-2">
                                        <LayoutDashboard size={20} className="text-amber-500" /> Organizer Dashboard
                                    </Link>
                                )}
                                <Link href='/mytickets' onClick={() => setIsMenuOpen(false)} className="w-full p-4 rounded-xl text-left text-lg font-medium hover:bg-white/5 text-white flex items-center gap-4">
                                    <Ticket size={20} className="text-primary" /> My Tickets
                                </Link>
                                <Link href='/profile' onClick={() => setIsMenuOpen(false)} className="w-full p-4 rounded-xl text-left text-lg font-medium hover:bg-white/5 text-white flex items-center gap-4">
                                    <User size={20} className="text-primary" /> Profile
                                </Link>
                            </>
                        )}
                        <Link href='/about' onClick={() => setIsMenuOpen(false)} className="w-full p-4 rounded-xl text-left text-lg font-medium hover:bg-white/5 text-white flex items-center gap-4">
                            <Info size={20} className="text-primary" /> About Us
                        </Link>
                        <Link href='/support' onClick={() => setIsMenuOpen(false)} className="w-full p-4 rounded-xl text-left text-lg font-medium hover:bg-white/5 text-white flex items-center gap-4">
                            <Info size={20} className="text-primary" /> Support
                        </Link>
                    </div>

                    <div className="mt-auto pt-6 border-t border-white/10 space-y-4">
                        <button
                            onClick={() => { setIsLocationModalOpen(true); setIsMenuOpen(false); }}
                            className="w-full p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-white font-medium"
                        >
                            <span className="flex items-center gap-2"><MapPin size={18} className="text-primary" /> {location ? location.city : 'Select Location'}</span>
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
                                    onClick={() => setIsMenuOpen(false)}
                                    className="p-4 rounded-xl bg-white/5 text-white font-bold text-center"
                                >
                                    Log In
                                </Link>
                                <Link href='/auth'
                                    onClick={() => setIsMenuOpen(false)}
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
                canClose={!!location}
                selectedCity={location?.city}
            />
            <NotificationPanel
                isOpen={isNotificationOpen}
                onClose={() => setIsNotificationOpen(false)}
            />
        </>
    );
};