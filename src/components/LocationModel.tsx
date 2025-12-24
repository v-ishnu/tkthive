import React, { useMemo } from 'react';
import { X, Search, Crosshair, MapPin } from 'lucide-react';
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

  const popularSet = useMemo(() => POPULAR_CITIES.slice(0, 8), []);
  const otherLocations = useMemo(() => POPULAR_CITIES.slice(8), []);

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={canClose ? onClose : undefined}
      />

      {/* Modal Content - Bottom Sheet on Mobile, Modal on Desktop */}
      <div className="relative bg-card border-t sm:border border-white/10 w-full max-w-2xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom zoom-in-0 sm:zoom-in-95 duration-300 rounded-t-3xl sm:rounded-2xl h-[85vh] sm:h-auto flex flex-col">

        {/* Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center shrink-0">
          <h3 className="text-xl font-bold">Select Location</h3>
          {canClose && (
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors">
              <X size={20} />
            </button>
          )}
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar">
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

          <h4 className="text-gray-400 text-sm font-medium mb-6 uppercase tracking-wider">Popular Cities</h4>

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-y-8 gap-x-4 mb-10">
            {popularSet.map((loc) => (
              <button
                key={loc.city}
                onClick={() => onSelect(loc)}
                className="group flex flex-col items-center gap-3"
              >
                {/* Profile Style Image */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-white/10 p-1 group-hover:border-primary transition-all relative overflow-hidden">
                  {loc.imageUrl ? (
                    <img
                      src={loc.imageUrl}
                      alt={loc.city}
                      className="w-full h-full rounded-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-white/5 flex items-center justify-center text-xl font-bold text-gray-400 group-hover:text-white group-hover:bg-white/10">
                      {loc.city.charAt(0)}
                    </div>
                  )}
                </div>
                <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                  {loc.city}
                </span>
              </button>
            ))}
          </div>

          {/* Other Locations List */}
          {otherLocations.length > 0 && (
            <>
              <h4 className="text-gray-400 text-sm font-medium mb-4 uppercase tracking-wider">Other Locations</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {otherLocations.map((loc) => (
                  <button
                    key={loc.city}
                    onClick={() => onSelect(loc)}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-left text-gray-300 hover:text-white border border-transparent hover:border-white/5 transition-all"
                  >
                    <div className="p-2 bg-white/5 rounded-full shrink-0">
                      <MapPin size={16} className="text-gray-400" />
                    </div>
                    <span className="font-medium">{loc.city}</span>
                  </button>
                ))}
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
};
