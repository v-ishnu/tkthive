
import React, { useState } from 'react';
import { X, Copy, Check, Facebook, Twitter, Linkedin, MessageCircle } from 'lucide-react';

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    url: string;
    title: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, url, title }) => {
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const shareLinks = [
        {
            name: 'WhatsApp',
            icon: MessageCircle,
            color: 'bg-[#25D366] hover:bg-[#20bd5a]',
            url: `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`
        },
        {
            name: 'Twitter',
            icon: Twitter,
            color: 'bg-[#1DA1F2] hover:bg-[#1a91da]',
            url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`
        },
        {
            name: 'Facebook',
            icon: Facebook,
            color: 'bg-[#4267B2] hover:bg-[#3b5998]',
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
        },
        {
            name: 'LinkedIn',
            icon: Linkedin,
            color: 'bg-[#0077b5] hover:bg-[#00669c]',
            url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
        }
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="relative w-full max-w-md bg-[#0f0f13] border border-white/10 rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">Share Event</h3>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Social Links */}
                <div className="grid grid-cols-4 gap-4 mb-8">
                    {shareLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center gap-2 group"
                        >
                            <div className={`w-12 h-12 flex items-center justify-center rounded-full text-white transition-all transform group-hover:scale-110 shadow-lg ${link.color}`}>
                                <link.icon size={20} />
                            </div>
                            <span className="text-xs text-gray-400 group-hover:text-white transition-colors">{link.name}</span>
                        </a>
                    ))}
                </div>

                {/* Copy Link Section */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400">Page Link</label>
                    <div className="flex items-center gap-2 p-2 bg-black/50 border border-white/10 rounded-xl">
                        <input
                            type="text"
                            readOnly
                            value={url}
                            className="flex-1 bg-transparent text-sm text-gray-300 outline-none px-2"
                        />
                        <button
                            onClick={handleCopy}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${copied
                                    ? 'bg-green-500/20 text-green-400'
                                    : 'bg-primary hover:bg-primary/90 text-black'
                                }`}
                        >
                            {copied ? (
                                <>
                                    <Check size={16} />
                                    Copied
                                </>
                            ) : (
                                <>
                                    <Copy size={16} />
                                    Copy
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
