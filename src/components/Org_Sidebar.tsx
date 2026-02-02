"use client"
import React from 'react';
import Link from 'next/link';
import {
    LayoutDashboard,
    Calendar,
    PlusCircle,
    CreditCard,
    Bell,
    Settings,
    LogOut,
    Hexagon,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { View } from '../types';

interface SidebarProps {
    currentView: View;
    setView: (view: View) => void;
    onLogout: () => void;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, onLogout, isOpen, setIsOpen }) => {
    const menuItems = [
        { id: View.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
        { id: View.EVENTS, label: 'My Events', icon: Calendar },
        { id: View.CREATE_EVENT, label: 'Create Event', icon: PlusCircle },
        { id: View.PAYMENTS, label: 'Payments', icon: CreditCard },
        { id: View.NOTIFICATIONS, label: 'Push Alert', icon: Bell },
    ];

    return (
        <div
            className={`bg-card border-r border-border transition-all duration-300 flex flex-col h-full ${isOpen ? 'w-52' : 'w-20'}`}
        >
            <div className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link href='/' className="flex items-center gap-3 group cursor-pointer">
                        <div className="flex items-center gap-3 group cursor-pointer">
                            <img src="/logo/blacklogo.png" alt="tkthive" className="h-10 w-auto object-contain group-hover:opacity-80 transition-opacity" />
                        </div>
                    </Link>
                </div>
            </div>

            <nav className="flex-1 px-4 mt-4">
                <div className="space-y-1">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = currentView === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setView(item.id)}
                                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${isActive
                                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                                    : 'text-text-secondary hover:bg-primary/10 hover:text-primary-hover'
                                    }`}
                            >
                                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'group-hover:text-primary'}`} />
                                {isOpen && <span className="font-medium">{item.label}</span>}
                            </button>
                        );
                    })}
                </div>

                <div className="mt-8">
                    {isOpen && <p className="text-xs font-semibold text-text-muted uppercase tracking-wider px-3 mb-2">General</p>}
                    <button
                        onClick={() => setView(View.SETTINGS)}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${currentView === View.SETTINGS
                            ? 'bg-primary text-white shadow-md'
                            : 'text-text-secondary hover:bg-primary/10 hover:text-primary-hover'
                            }`}
                    >
                        <Settings className="w-5 h-5" />
                        {isOpen && <span className="font-medium">Settings</span>}
                    </button>
                </div>
            </nav>

            <div className="p-4 border-t border-border">
                <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all duration-200"
                >
                    <LogOut className="w-5 h-5" />
                    {isOpen && <span className="font-medium">Logout</span>}
                </button>
            </div>


        </div>
    );
};

export default Sidebar;
