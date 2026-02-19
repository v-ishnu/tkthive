import React from 'react';
import { Bell, X, CheckCircle } from 'lucide-react';

interface PushPermissionModalProps {
    open: boolean;
    onAccept: () => void;
    onClose: () => void;
}

const PushPermissionModal: React.FC<PushPermissionModalProps> = ({ open, onAccept, onClose }) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="relative w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden transform transition-all scale-100">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 p-2 bg-neutral-800/50 hover:bg-neutral-800 rounded-full text-neutral-400 hover:text-white transition-colors z-10"
                >
                    <X size={16} />
                </button>

                {/* Header / Graphic */}
                <div className="flex flex-col items-center pt-8 pb-4 px-6 bg-linear-to-b from-neutral-800/50 to-transparent">
                    <div className="p-4 bg-primary/10 rounded-full mb-4 ring-1 ring-primary/20">
                        <Bell size={32} className="text-primary animate-pulse" />
                    </div>
                    <h3 className="text-xl font-bold text-white text-center">Enable Notifications</h3>
                </div>

                {/* Content */}
                <div className="px-6 pb-6 text-center">
                    <p className="text-neutral-400 text-sm mb-6 leading-relaxed">
                        Stay in the loop! Get instant updates on your bookings, event reminders, and exclusive offers newly available on tkthive.
                    </p>

                    <div className="space-y-3">
                        <button
                            onClick={onAccept}
                            className="w-full py-3.5 px-4 bg-primary hover:bg-primary-hover text-black font-bold rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                        >
                            <CheckCircle size={18} />
                            Allow Notifications
                        </button>
                        <button
                            onClick={onClose}
                            className="w-full py-3.5 px-4 bg-transparent hover:bg-neutral-800 text-neutral-400 hover:text-white font-medium rounded-xl transition-colors text-sm"
                        >
                            Maybe Later
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default PushPermissionModal;
