"use client";
import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logoutUser } from '@/store/slices/authslice';
import Sidebar from '@/components/Org_Sidebar';
import Header from '@/components/Org_Header';
import { View } from '@/types';
import { Loader2 } from 'lucide-react';

export default function OrganizerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useAppDispatch();
    const { user, isLoading, isInitialized } = useAppSelector((state) => state.auth);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Initial Auth Check
    useEffect(() => {
        // Wait for auth to be initialized
        if (isInitialized) {
            if (!user) {
                // Not logged in
                router.push('/auth');
            } else if (user.role !== 'ORGANIZER') {
                // Logged in but not an organizer
                router.push('/');
            }
        }
    }, [user, isLoading, isInitialized, router]);

    // Map Pathname to View
    const getCurrentView = (): View => {
        if (pathname?.includes('/organizer/events')) return View.EVENTS;
        if (pathname?.includes('/organizer/create-event')) return View.CREATE_EVENT;
        if (pathname?.includes('/organizer/payments')) return View.PAYMENTS;
        if (pathname?.includes('/organizer/notifications')) return View.NOTIFICATIONS;
        if (pathname?.includes('/organizer/settings')) return View.SETTINGS;
        if (pathname?.includes('/organizer/scanner')) return View.SCANNER;
        return View.DASHBOARD;
    };

    const currentView = getCurrentView();

    const handleSetView = (view: View) => {
        switch (view) {
            case View.DASHBOARD:
                router.push('/organizer/dashboard');
                break;
            case View.EVENTS:
                router.push('/organizer/events'); // Assuming route exists or will exist
                break;
            case View.CREATE_EVENT:
                router.push('/organizer/create-event'); // Assuming route exists
                break;
            case View.PAYMENTS:
                router.push('/organizer/payments');
                break;
            case View.NOTIFICATIONS:
                router.push('/organizer/push-notification');
                break;
            case View.SETTINGS:
                router.push('/organizer/settings');
                break;
            case View.SCANNER:
                router.push('/organizer/scanner');
                break;
            default:
                break;
        }
    };

    const handleLogout = async () => {
        await dispatch(logoutUser());
        router.push('/');
    };

    // Show loading spinner while checking auth
    if (isLoading || !isInitialized) {
        return (
            <div className="flex h-screen w-full items-center justify-center ">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-10 w-10 animate-spin text-amber-500" />
                    <p className="text-gray-500 font-medium">Verifying Organizer Access...</p>
                </div>
            </div>
        );
    }

    // Protect render
    if (!user || user.role !== 'ORGANIZER') {
        return null; // Will redirect via useEffect
    }

    return (
        <div className="flex h-screen w-full bg-gray-50 theme-organizer text-foreground">
            <Sidebar
                currentView={currentView}
                setView={handleSetView}
                onLogout={handleLogout}
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}
            />

            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <Header
                    currentView={currentView}
                    toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                    user={user}
                />

                <main className="flex-1 overflow-y-auto p-4 lg:p-8" data-lenis-prevent>
                    {children}
                </main>
            </div>
        </div>
    );
}
