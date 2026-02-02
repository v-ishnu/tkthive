"use client"
import React from 'react';
import { Search, Bell, Mail, User } from 'lucide-react';
import { View } from '../types';

interface HeaderProps {
    currentView: View;
    toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentView }) => {
    const getTitle = () => {
        switch (currentView) {
            case View.DASHBOARD: return 'Dashboard Overview';
            case View.EVENTS: return 'Events Management';
            case View.CREATE_EVENT: return 'New Event Registration';
            case View.PAYMENTS: return 'Financial Analytics';
            case View.NOTIFICATIONS: return 'Campaign Center';
            default: return 'Tkt Hive';
        }
    };

    return (
        <header className="bg-card/80 backdrop-blur-md border-b border-border sticky top-0 z-10 px-8 py-4 flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold text-text-main">{getTitle()}</h1>
                <p className="text-sm text-text-muted">Welcome back, Hive Organizer</p>
            </div>

            <div className="flex items-center gap-6">
                <div className="relative hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search transactions..."
                        className="pl-10 pr-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all w-64 text-sm"
                    />
                </div>

                <div className="flex items-center gap-3 border-r border-border pr-6">
                    <button className="relative p-2 text-text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-all">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full border-2 border-card"></span>
                    </button>
                    <button className="p-2 text-text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-all">
                        <Mail className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex items-center gap-3 cursor-pointer group">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-semibold text-text-main group-hover:text-primary-hover transition-colors">Alex Morgan</p>
                        <p className="text-xs text-text-muted italic">Platinum Organizer</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-hover border-2 border-card shadow-md flex items-center justify-center text-white font-bold">
                        AM
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
