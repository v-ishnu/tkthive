import React, { useEffect, useRef } from "react";
import { X, Bell, Calendar, Ticket, Tag } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchNotifications,
  markRead,
  markAllRead,
  Notification,
} from "@/store/slices/notificationSlice";
import { on } from "events";

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({
  isOpen,
  onClose,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const { notifications, loading, unreadCount } = useAppSelector(
    (state) => state.notification,
  );
  const [selectedNotification, setSelectedNotification] =
    React.useState<Notification | null>(null);

  // Close on click outside
  // useEffect(() => {
  //     const handleClickOutside = (event: MouseEvent) => {
  //         if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
  //             onClose();
  //         }
  //     };

  //     if (isOpen) {
  //         document.addEventListener('mousedown', handleClickOutside);
  //     }

  //     return () => {
  //         document.removeEventListener('mousedown', handleClickOutside);
  //     };
  // }, [isOpen, onClose]);

  const handleMarkRead = (id: string) => {
    dispatch(markRead(id));
  };

  const handleMarkAllRead = () => {
    dispatch(markAllRead());
  };

  const getIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case "ticket":
        return <Ticket size={16} className="text-emerald-400" />;
      case "reminder":
        return <Calendar size={16} className="text-blue-400" />;
      case "offer":
        return <Tag size={16} className="text-primary" />;
      default:
        return <Bell size={16} className="text-gray-400" />;
    }
  };

return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 z-[100] overflow-hidden ${
                    isOpen ? 'pointer-events-auto' : 'pointer-events-none'
                }`}
            >
                {/* Backdrop */}
                <div
                    onClick={onClose}
                    className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
                        isOpen ? 'opacity-100' : 'opacity-0'
                    }`}
                />

                {/* Sliding Panel */}
                <div
                    ref={panelRef}
                    onClick={(e) => e.stopPropagation()}
                    className={`
                        absolute right-0 top-0 h-full
                        w-full lg:w-[720px]
                        bg-secondary border-l border-white/10 shadow-2xl
                        transform transition-transform duration-300 ease-in-out
                        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
                    `}
                >
                    <div className="h-full flex flex-col lg:grid lg:grid-cols-[1fr_380px]">

                        {/* LEFT SIDE — PREVIEW (Desktop) */}
                        <div className="hidden lg:flex flex-col relative overflow-hidden border-r border-white/5">
                            <div
                                className={`absolute inset-0 transition-all duration-300 ease-in-out ${
                                    selectedNotification
                                        ? 'translate-x-0 opacity-100'
                                        : '-translate-x-8 opacity-0'
                                }`}
                            >
                                {selectedNotification ? (
                                    <div className="h-full flex flex-col">
                                        <div className="p-6 border-b border-white/5">
                                            <h3 className="text-lg font-bold text-white">
                                                {selectedNotification.title}
                                            </h3>
                                            <div className="text-xs text-zinc-500 mt-2">
                                                {new Date(selectedNotification.createdAt).toLocaleString()}
                                            </div>
                                        </div>

                                        <div className="flex-1 p-6 overflow-y-auto text-sm text-zinc-300 leading-relaxed">
                                            {selectedNotification.message}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-zinc-500">
                                        Select a notification
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* RIGHT SIDE — LIST */}
                        <div className="flex flex-col">

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
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onClose();
                                    }}
                                    className="p-2 hover:bg-white/10 rounded-full text-zinc-400 hover:text-white transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* List */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                {loading ? (
                                    <div className="text-center text-gray-500 py-8">Loading...</div>
                                ) : notifications.length > 0 ? (
                                    notifications.map((notif) => (
                                        <div
                                            key={notif.id}
                                            onClick={() => {
                                                if (!notif.isRead) handleMarkRead(notif.id);
                                                setSelectedNotification(notif);
                                            }}
                                            className={`p-4 rounded-xl cursor-pointer transition-all border
                                                ${
                                                    selectedNotification?.id === notif.id
                                                        ? 'bg-primary/10 border-primary/30'
                                                        : 'bg-tertiary border-white/5 hover:bg-elevated'
                                                }
                                            `}
                                        >
                                            <div className="flex gap-3">
                                                <div className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5">
                                                    {getIcon(notif.type)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-semibold text-sm text-white truncate">
                                                        {notif.title}
                                                    </div>
                                                    <div className="text-xs text-zinc-400 line-clamp-2">
                                                        {notif.message}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center text-gray-500 py-8">
                                        No notifications
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="p-4 border-t border-white/5 bg-black/20">
                                <button
                                    onClick={handleMarkAllRead}
                                    disabled={unreadCount === 0}
                                    className="w-full py-3 rounded-xl hover:bg-white/5 text-sm font-bold text-primary transition-colors disabled:opacity-50"
                                >
                                    Mark all as read
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* MOBILE FULLSCREEN MODAL */}
            {selectedNotification && (
                <div className="lg:hidden fixed inset-0 z-[200] flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-black/70"
                        onClick={() => setSelectedNotification(null)}
                    />
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="relative bg-secondary w-[90%] max-w-md rounded-2xl p-6 z-10"
                    >
                        <div className="flex justify-between mb-4">
                            <h3 className="text-lg font-bold text-white">
                                {selectedNotification.title}
                            </h3>
                            <button onClick={() => setSelectedNotification(null)}>
                                <X size={18} />
                            </button>
                        </div>

                        <p className="text-sm text-zinc-300">
                            {selectedNotification.message}
                        </p>
                    </div>
                </div>
            )}
        </>
    );
};