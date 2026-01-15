import React, { useEffect, useRef } from 'react';
import { X, Bell, Calendar, Ticket, Tag } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchNotifications, markRead, markAllRead, Notification } from '@/store/slices/notificationSlice';

interface NotificationPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({ isOpen, onClose }) => {
    const panelRef = useRef<HTMLDivElement>(null);
    const dispatch = useAppDispatch();
    const { notifications, loading, unreadCount } = useAppSelector((state) => state.notification);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    const handleMarkRead = (id: string) => {
        dispatch(markRead(id));
    };

    const handleMarkAllRead = () => {
        dispatch(markAllRead());
    };

    const getIcon = (type: string) => {
        switch (type?.toLowerCase()) {
            case 'ticket': return <Ticket size={16} className="text-emerald-400" />;
            case 'reminder': return <Calendar size={16} className="text-blue-400" />;
            case 'offer': return <Tag size={16} className="text-primary" />;
            default: return <Bell size={16} className="text-gray-400" />;
        }
    };

    return (
        <div className={`fixed inset-0 z-[60] pointer-events-none overflow-hidden ${isOpen ? 'pointer-events-auto' : ''}`}>
            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
                aria-hidden="true"
            />

            {/* Panel */}
            <div
                ref={panelRef}
                className={`absolute right-0 top-0 h-full w-full sm:w-96 bg-secondary border-l border-white/10 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                {/* Header */}
                <div className="p-6 border-b border-white/5 flex items-center justify-between bg-black/20">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Bell size={20} className="text-white" />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-primary rounded-full border-2 border-secondary"></span>
                            )}
                        </div>
                        <h2 className="text-xl font-bold text-white">Notifications</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full text-zinc-400 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {loading && notifications.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">Loading...</div>
                    ) : notifications.length > 0 ? (
                        notifications.map((notif: Notification) => (
                            <div
                                key={notif.id}
                                onClick={() => !notif.isRead && handleMarkRead(notif.id)}
                                className={`p-4 rounded-xl border transition-all hover:bg-elevated cursor-pointer group ${notif.isRead ? 'bg-transparent border-transparent opacity-60' : 'bg-tertiary border-white/5'}`}
                            >
                                <div className="flex gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${notif.isRead ? 'bg-white/5' : 'bg-elevated'}`}>
                                        {getIcon(notif.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className={`text-sm font-bold truncate pr-2 ${notif.isRead ? 'text-zinc-500' : 'text-zinc-200'}`}>
                                                {notif.title}
                                            </h3>
                                            <span className="text-[10px] text-zinc-600 whitespace-nowrap">
                                                {new Date(notif.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed group-hover:text-zinc-300">
                                            {notif.message}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-8 text-center text-gray-500">No notifications</div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-white/5 bg-black/20">
                    <button
                        onClick={handleMarkAllRead}
                        disabled={unreadCount === 0}
                        className="w-full py-3 rounded-xl hover:bg-white/5 text-sm font-bold text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Mark all as read
                    </button>
                </div>
            </div>
        </div>
    );
};
