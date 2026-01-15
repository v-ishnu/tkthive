"use client";
import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, Info, X, Loader2 } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'loading';

export interface ToastProps {
    id: string;
    message: string;
    type: ToastType;
    duration?: number;
    onClose: (id: string) => void;
}

const icons = {
    success: <CheckCircle size={20} className="text-green-500" />,
    error: <AlertCircle size={20} className="text-red-500" />,
    info: <Info size={20} className="text-blue-500" />,
    loading: <Loader2 size={20} className="text-blue-500 animate-spin" />
};

const bgColors = {
    success: 'bg-green-500/10 border-green-500/20',
    error: 'bg-red-500/10 border-red-500/20',
    info: 'bg-blue-500/10 border-blue-500/20',
    loading: 'bg-blue-500/10 border-blue-500/20'
};

export const Toast: React.FC<ToastProps> = ({ id, message, type, duration = 5000, onClose }) => {
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(() => {
                handleClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [duration]);

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(() => {
            onClose(id);
        }, 300); // Wait for exit animation
    };

    return (
        <div
            className={`
                relative flex items-center gap-4 p-4 min-w-[320px] max-w-md rounded-xl border backdrop-blur-md shadow-lg transition-all duration-300 ease-in-out
                ${bgColors[type]}
                ${isExiting ? 'animate-slide-out opacity-0 translate-x-full' : 'animate-slide-in translate-x-0 opacity-100'}
            `}
            role="alert"
        >
            <div className="flex-shrink-0">
                {icons[type]}
            </div>

            <p className="flex-1 text-sm font-medium text-white/90">
                {message}
            </p>

            {/* Circular Timer for non-loading toasts */}
            {type !== 'loading' && duration > 0 && (
                <div className="relative w-6 h-6 flex-shrink-0 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 24 24">
                        <circle
                            className="text-gray-600"
                            strokeWidth="2"
                            stroke="currentColor"
                            fill="transparent"
                            r="10"
                            cx="12"
                            cy="12"
                        />
                        <circle
                            className={`${type === 'success' ? 'text-green-500' : type === 'error' ? 'text-red-500' : 'text-blue-500'} animate-countdown`}
                            strokeWidth="2"
                            strokeDasharray={2 * Math.PI * 10}
                            strokeDashoffset={0}
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="transparent"
                            r="10"
                            cx="12"
                            cy="12"
                            style={{
                                animationDuration: `${duration}ms`
                            }}
                        />
                    </svg>
                </div>
            )}

            <button
                onClick={handleClose}
                className="p-1 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
            >
                <X size={16} />
            </button>
        </div>
    );
};
