import React from 'react';
import { X, Search, Crosshair } from 'lucide-react';
import { LocationData } from '../types';
import { POPULAR_CITIES } from '../constants';


interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (location: LocationData) => void;
  canClose?: boolean;
}

export const LocationModal: React.FC<LocationModalProps> = ({ isOpen, onClose, onSelect, canClose = true }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={canClose ? onClose : undefined}
      />

      {/* Modal Content */}
      <div className="relative bg-card border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">

        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <h3 className="text-xl font-bold">Select Your Location</h3>
          {canClose && (
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white">
              <X size={20} />
            </button>
          )}
        </div>

        <div className="p-6">
          {/* Search Input */}
          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={20} />
            <input
              type="text"
              placeholder="Search for a city..."
              className="w-full bg-dark border border-white/10 rounded-xl py-4 pl-12 pr-12 text-white placeholder:text-gray-500 focus:border-primary/50 focus:outline-none transition-colors"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-primary">
              <Crosshair size={20} />
            </button>
          </div>

          <h4 className="text-gray-400 text-sm font-medium mb-4">Popular Cities</h4>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {POPULAR_CITIES.map((loc) => (
              <button
                key={loc.city}
                onClick={() => onSelect(loc)}
                className="group flex flex-col items-center justify-center p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-primary/30 transition-all"
              >
                {/* Simple Icon placeholder */}
                <div className="w-12 h-12 mb-3 rounded-full bg-dark flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-2xl text-primary opacity-50 group-hover:opacity-100">
                    {loc.city.charAt(0)}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-300 group-hover:text-white">{loc.city}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};