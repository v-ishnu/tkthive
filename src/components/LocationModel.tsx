import React, { useMemo, useEffect } from 'react';
import { X, Search, Crosshair, MapPin, Globe } from 'lucide-react';
import { LocationData } from '../types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchLocations } from '@/store/slices/eventSlice';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (location: LocationData) => void;
  canClose?: boolean;
}

export const LocationModal: React.FC<LocationModalProps> = ({ isOpen, onClose, onSelect, canClose = true }) => {
  const dispatch = useAppDispatch();
  const { locations: availableLocations } = useAppSelector((state) => state.event);

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchLocations());
    }
  }, [dispatch, isOpen]);

  const sortedLocations = useMemo(() => {
    return availableLocations.map(city => ({
      city,
      country: 'India',
      imageUrl: ''
    })).sort((a, b) => a.city.localeCompare(b.city));
  }, [availableLocations]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center sm:p-4">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={canClose ? onClose : undefined}
      />

      <div className="relative bg-[var(--bg-card)] border border-[var(--border-color)] w-full max-w-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 rounded-t-3xl sm:rounded-2xl flex flex-col max-h-[85vh]">

        {/* Header */}
        <div className="p-6 border-b border-[var(--border-color)] flex justify-between items-center shrink-0">
          <h3 className="text-xl font-bold text-[var(--text-primary)]">Select Location</h3>
          {canClose && (
            <button onClick={onClose} className="p-2 hover:bg-[var(--bg-elevated)] rounded-full text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
              <X size={20} />
            </button>
          )}
        </div>

        <div className="p-8 overflow-y-auto custom-scrollbar flex-1">

          {/* Top "All Locations" Option */}
          <div className="mb-8">
            <button
              onClick={() => onSelect({ city: 'All', country: 'Global', imageUrl: '' })}
              className="flex items-center gap-3 text-primary hover:text-primary-hover transition-colors font-bold text-lg group"
            >
              <div className="p-2 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                <Globe size={20} />
              </div>
              All Locations
            </button>
          </div>

          {/* Available Cities Header */}
          <h4 className="text-[var(--text-primary)] font-bold mb-6 text-lg">Available Cities</h4>

          {/* City Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-y-4 gap-x-8">
            {sortedLocations.length > 0 ? (
              sortedLocations.map((loc) => (
                <button
                  key={loc.city}
                  onClick={() => onSelect(loc)}
                  className="text-left text-[var(--text-secondary)] hover:text-primary transition-colors text-sm py-1"
                >
                  {loc.city}
                </button>
              ))
            ) : (
              <div className="col-span-full text-[var(--text-muted)] py-8 italic">
                No events near you
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
