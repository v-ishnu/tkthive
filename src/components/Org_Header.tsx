"use client"
import React from 'react';
import { Search, Bell, Mail, User as UserIcon, Menu } from 'lucide-react';
import { View, User } from '../types';

interface HeaderProps {
    currentView: View;
    toggleSidebar: () => void;
    user: User | null;
}

const Header: React.FC<HeaderProps> = ({ currentView, user, toggleSidebar }) => {
    const getTitle = () => {
        switch (currentView) {
            case View.DASHBOARD: return 'Dashboard Overview';
            case View.EVENTS: return 'Events Management';
            case View.CREATE_EVENT: return 'New Event Registration';
            case View.PAYMENTS: return 'Financial Analytics';
            case View.NOTIFICATIONS: return 'Campaign Center';
            case View.SCANNER: return 'Ticket Scanner';
            default: return 'tkthive';
        }
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .substring(0, 2)
            .toUpperCase();
    };

    return (
        <header className="bg-card/80 backdrop-blur-md border-b border-border sticky top-0 z-10 px-4 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <button
                    onClick={toggleSidebar}
                    className="p-2 -ml-2 text-text-muted hover:bg-background rounded-lg lg:hidden"
                >
                    <Menu className="w-6 h-6" />
                </button>
                <div>
                    <h1 className="text-xl lg:text-2xl font-bold text-text-main">{getTitle()}</h1>
                    <p className="text-xs lg:text-sm text-text-muted hidden sm:block">Welcome back, Hive Organizer</p>
                </div>
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
                        <p className="text-sm font-semibold text-text-main group-hover:text-primary-hover transition-colors">
                            {user?.name || 'Organizer'}
                        </p>
                        <p className="text-xs text-text-muted italic">
                            {user?.platformRole || 'Organizer'}
                        </p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-hover border-2 border-card shadow-md flex items-center justify-center text-white font-bold overflow-hidden">
                        {user?.avatar ? (
                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                            <span>{user?.name ? getInitials(user.name) : 'OR'}</span>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
