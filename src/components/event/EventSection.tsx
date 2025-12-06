
import React, { useState, useMemo, useEffect } from 'react';
import { EventGrid } from './EventGrid';
import { EventData } from '../../types';
import { Calendar, PlayCircle, CheckCircle, Filter } from 'lucide-react';
import { EventsFilterSidebar, FilterState } from './EventFilterSidebar';

interface EventsSectionProps {
  events: EventData[];
  loading: boolean;
  onEventClick: (event: EventData) => void;
  locationCity: string;
  selectedCategory: string; // Passed from App/Navbar
  onCategoryChange: (category: string) => void;
}

export const EventsSection: React.FC<EventsSectionProps> = ({ 
  events, 
  loading, 
  onEventClick, 
  locationCity, 
  selectedCategory, 
  onCategoryChange 
}) => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'live' | 'completed'>('upcoming');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Initialize detailed filters
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    location: '', // Local location filter override
    dateRange: 'any',
    price: { free: true, paid: true },
    access: { public: true, private: true },
    category: selectedCategory
  });

  // Sync prop category change to local filter state
  useEffect(() => {
    setFilters(prev => ({ ...prev, category: selectedCategory }));
  }, [selectedCategory]);

  // Sync local filter category change back to parent
  useEffect(() => {
    if (filters.category !== selectedCategory) {
        onCategoryChange(filters.category);
    }
  }, [filters.category, onCategoryChange, selectedCategory]);

  // Derive categories list (Still used for internal logic if needed, but removed from UI)
  const categories = useMemo(() => {
    const cats = new Set(events.map(e => e.category || 'Other'));
    const defaults = ['Music', 'Sports', 'Art', 'Tech', 'Gaming'];
    defaults.forEach(c => cats.add(c));
    return ['All', ...Array.from(cats)];
  }, [events]);

  // Main Filter Logic
  const filteredEvents = useMemo(() => {
    let result = [...events];
    const now = new Date();

    // 1. Tab Logic (High level status)
    if (activeTab === 'live') {
      result = result.filter(e => e.isLive);
    } else if (activeTab === 'completed') {
      result = result.filter(e => {
        if (e.results && e.results.length > 0) return true;
        try {
            const d = new Date(e.date);
            return !isNaN(d.getTime()) && d < now;
        } catch { return false; }
      });
    } else {
      // Upcoming
      result = result.filter(e => {
         if (e.isLive) return false;
         try {
            const d = new Date(e.date);
            return isNaN(d.getTime()) || d >= now;
         } catch { return true; }
      });
    }

    // 2. Sidebar Filters
    
    // Category
    if (filters.category !== 'All') {
      result = result.filter(e => e.category === filters.category);
    }

    // Search (Title or Venue)
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(e => 
        e.title.toLowerCase().includes(q) || 
        e.venue.toLowerCase().includes(q)
      );
    }

    // Location (User Input Override)
    if (filters.location) {
        const q = filters.location.toLowerCase();
        result = result.filter(e => e.venue.toLowerCase().includes(q));
    } 
    // Note: Removed automatic strict filtering by `locationCity` to ensure cards are visible 
    // even if the venue string format doesn't exactly match the selected city.

    // Access
    if (!filters.access.public) result = result.filter(e => e.accessType !== 'public');
    if (!filters.access.private) result = result.filter(e => e.accessType !== 'private');

    // Price
    if (!filters.price.free) result = result.filter(e => e.price.toLowerCase() === 'free');
    if (!filters.price.paid) result = result.filter(e => e.price.toLowerCase() !== 'free');

    // Date Range
    if (filters.dateRange !== 'any') {
        result = result.filter(e => {
            const d = new Date(e.date);
            if (isNaN(d.getTime())) return false;

            if (filters.dateRange === 'today') {
                return d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
            }
            if (filters.dateRange === 'tomorrow') {
                const tomorrow = new Date(now);
                tomorrow.setDate(tomorrow.getDate() + 1);
                return d.getDate() === tomorrow.getDate() && d.getMonth() === tomorrow.getMonth() && d.getFullYear() === tomorrow.getFullYear();
            }
            if (filters.dateRange === 'weekend') {
                const day = d.getDay(); // 0 is Sunday, 6 is Saturday
                // Simple logic: Is it Sat or Sun?
                return day === 0 || day === 6 || (day === 5 && d.getHours() >= 17); // Friday evening + Weekend
            }
            return true;
        });
    }

    return result;
  }, [events, activeTab, filters]);

  return (
    <div id="events-section" className="min-h-screen">
        {/* Header Tabs */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 pb-6 border-b border-white/10 gap-4">
            <div>
              <h2 className="text-4xl font-bold mb-2 text-white">
                Discover Events
              </h2>
              <p className="text-gray-400">Explore popular events {locationCity ? `in ${locationCity}` : 'near you'}</p>
            </div>
            
            {/* Tabs */}
            <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
                <button 
                  onClick={() => setActiveTab('upcoming')}
                  className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'upcoming' ? 'bg-primary text-black shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                    <Calendar size={16} /> Upcoming
                </button>
                <button 
                  onClick={() => setActiveTab('live')}
                  className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'live' ? 'bg-red-600 text-white shadow-lg animate-pulse' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                    <PlayCircle size={16} /> Live
                </button>
                <button 
                  onClick={() => setActiveTab('completed')}
                  className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'completed' ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                    <CheckCircle size={16} /> Past
                </button>
            </div>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Mobile Filter Toggle */}
            <button 
                className="lg:hidden w-full py-3 bg-white/5 border border-white/10 rounded-xl text-white font-bold flex items-center justify-center gap-2 mb-4"
                onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            >
                <Filter size={18} /> {isMobileFilterOpen ? 'Hide Filters' : 'Show Filters'}
            </button>

            {/* Sidebar (Desktop + Mobile Collapsible) */}
            <div className={`lg:w-1/4 sticky top-24 z-30 ${isMobileFilterOpen ? 'block' : 'hidden lg:block'}`}>
                <EventsFilterSidebar 
                    filters={filters} 
                    setFilters={setFilters} 
                    categories={categories} 
                />
            </div>

            {/* Results Grid */}
            <div className="lg:w-3/4 w-full">
                <div className="mb-4 text-sm text-gray-400 font-medium">
                    Showing {filteredEvents.length} results
                </div>

                <EventGrid 
                    events={filteredEvents} 
                    loading={loading} 
                    onEventClick={onEventClick}
                />
                
                {!loading && filteredEvents.length === 0 && (
                    <div className="text-center py-20 bg-card/50 rounded-3xl border border-dashed border-white/10 mt-4">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Filter className="text-gray-500" size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No matches found</h3>
                        <p className="text-gray-500 max-w-md mx-auto">
                            We couldn't find any events matching your specific filters. 
                            Try resetting the "Access" or "Price" filters to see more results.
                        </p>
                        <button 
                            onClick={() => setFilters({
                                search: '',
                                location: '',
                                dateRange: 'any',
                                price: { free: true, paid: true },
                                access: { public: true, private: true },
                                category: 'All'
                            })}
                            className="mt-6 px-6 py-2 bg-white/5 hover:bg-white/10 text-white rounded-full text-sm font-bold border border-white/10 transition-colors"
                        >
                            Reset All Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};
