import React from "react";
import { X } from "lucide-react";

interface NotificationMessageModalProps {
    open: boolean;
    title: string;
    message: string;
    onClose: () => void;
}

const NotificationMessageModal: React.FC<NotificationMessageModalProps> = ({ open, title, message, onClose }) => {
    if (!open) return null;
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
                <button 
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >
                    <X size={20} />
                </button>
                <h3 className="text-lg font-semibold mb-2">{title}</h3>
                <p className="text-gray-700">{message}</p>
            </div>
        </div>
    )
}


export default NotificationMessageModal;