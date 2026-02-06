

import React, { useState, useMemo, useEffect } from 'react';
import { EventGrid } from './EventGrid';
import { EventData } from '../../types';
import {
  Calendar, PlayCircle, Filter, X, Cpu, Gamepad2, Palette,
  Music, Trophy, PartyPopper, MoreHorizontal, Search, MapPin
} from 'lucide-react';
import { FilterState } from './EventFilterSidebar';

interface EventsSectionProps {
  events: EventData[];
  loading: boolean;
  onEventClick: (event: EventData) => void;
  locationCity: string;
  availableLocations?: string[];
  selectedCategory: string; // Passed from App/Navbar
  onCategoryChange: (category: string) => void;
}

// Category Configuration
const CATEGORY_PROFILES = [
  {
    id: 'TECH',
    label: 'Tech & Coding',
    icon: Cpu,
    description: "Hackathons, Webinars, Summits, and Workshops.",
    banner: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop",
    color: "text-blue-400",
    gradient: "from-blue-600/20 to-blue-900/5",
    subTabs: ['All', 'Hackathon', 'Webinar', 'Summit', 'Workshop']
  },
  {
    id: 'ESPORTS',
    label: 'Esports',
    icon: Gamepad2,
    description: "Tournaments, Scrims, and LAN Events.",
    banner: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop",
    color: "text-purple-400",
    gradient: "from-purple-600/20 to-purple-900/5",
    subTabs: ['All', 'Tournament', 'Scrims', 'LAN Event']
  },
  {
    id: 'SPORTS',
    label: 'Sports',
    icon: Trophy,
    description: "Cricket, Football, Marathons, and more.",
    banner: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=2070&auto=format&fit=crop",
    color: "text-orange-400",
    gradient: "from-orange-600/20 to-orange-900/5",
    subTabs: ['All', 'Cricket', 'Football', 'Marathon', 'Badminton']
  },
  {
    id: 'ARTS',
    label: 'Arts & Culture',
    icon: Palette,
    description: "Exhibitions, Workshops, Theatre, and Stand-up.",
    banner: "https://images.unsplash.com/photo-1518998053901-5348d3969104?q=80&w=1974&auto=format&fit=crop",
    color: "text-pink-400",
    gradient: "from-pink-600/20 to-pink-900/5",
    subTabs: ['All', 'Exhibition', 'Workshop', 'Theatre', 'Comedy']
  },
  {
    id: 'FEST',
    label: 'Festivals',
    icon: PartyPopper,
    description: "Cultural, Food, and Music Festivals.",
    banner: "https://images.unsplash.com/photo-1533174072545-e8d4aa97edf9?q=80&w=2070&auto=format&fit=crop",
    color: "text-yellow-400",
    gradient: "from-yellow-600/20 to-yellow-900/5",
    subTabs: ['All', 'Music', 'Food', 'Cultural']
  },
  {
    id: 'CONCERT',
    label: 'Concerts',
    icon: Music,
    description: "Live Gigs, DJ Nights, and Performances.",
    banner: "https://images.unsplash.com/photo-1459749411177-d2841fbd74e0?q=80&w=2070&auto=format&fit=crop",
    color: "text-green-400",
    gradient: "from-green-600/20 to-green-900/5",
    subTabs: ['All', 'Live Gig', 'DJ Night', 'Classical']
  },
  {
    id: 'OTHERS',
    label: 'Others',
    icon: MoreHorizontal,
    description: "Networking, Meetups, and Miscellaneous.",
    banner: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=2070&auto=format&fit=crop",
    color: "text-text-secondary",
    gradient: "from-gray-600/20 to-gray-900/5",
    subTabs: ['All', 'Networking', 'Meetup', 'Charity']
  },
  {
    id: 'All',
    label: 'All Events',
    icon: Calendar,
    description: "Explore everything happening around you.",
    banner: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop",
    color: "text-primary",
    gradient: "from-primary/20 to-primary/5",
    subTabs: ['All', 'Upcoming', 'Live', 'Past']
  }
];

export const EventsSection: React.FC<EventsSectionProps> = ({
  events,
  loading,
  onEventClick,
  locationCity,
  availableLocations = [],
  selectedCategory,
  onCategoryChange
}) => {
  const [activeSubTab, setActiveSubTab] = useState('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Initialize detailed filters
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    location: '',
    dateRange: 'any',
    price: { free: true, paid: true },
    access: { public: true, private: true },
    category: selectedCategory
  });

  // Sync prop category change to local filter state
  useEffect(() => {
    setFilters(prev => ({ ...prev, category: selectedCategory }));
    setActiveSubTab('All'); // Reset subtab on category switch
  }, [selectedCategory]);

  // Helper to normalize category ID (handle case sensitivity)
  const getNormalizedCategory = (cat: string) => {
    if (!cat || cat.toLowerCase() === 'all') return 'All';
    return cat.toUpperCase();
  };

  const activeProfileId = getNormalizedCategory(filters.category);

  // Derive Current Profile
  const currentProfile = CATEGORY_PROFILES.find(p => p.id === activeProfileId) || CATEGORY_PROFILES.find(p => p.id === 'All')!;

  // Main Filter Logic
  const filteredEvents = useMemo(() => {
    let result = [...events];
    const now = new Date();

    // 1. Main Category Filtering
    if (activeProfileId !== 'All') {
      result = result.filter(e => e.category === activeProfileId);
    }

    // 2. Sub-Category/Tab Filtering
    if (activeSubTab !== 'All') {
      if (filters.category === 'All') {
        // If All category, treat tabs as Time Status (Existing logic)
        if (activeSubTab === 'Live') result = result.filter(e => {
          if (e.isLive) return true;
          try {
            const start = e.startDate ? new Date(e.startDate) : new Date(e.date);
            const end = e.endDate
              ? new Date(e.endDate)
              : (start ? new Date(start.getTime() + 86400000) : null);

            if (start && end) {
              return now >= start && now <= end;
            }
            return false;
          } catch { return false; }
        });
        else if (activeSubTab === 'Past') result = result.filter(e => {
          try {
            const start = e.startDate ? new Date(e.startDate) : new Date(e.date);
            const end = e.endDate
              ? new Date(e.endDate)
              : (start ? new Date(start.getTime() + 86400000) : null);

            if (end) {
              return now > end;
            }
            return false;
          } catch { return false; }
        });
        else if (activeSubTab === 'Upcoming') result = result.filter(e => {
          try {
            const start = e.startDate ? new Date(e.startDate) : new Date(e.date);
            if (start) {
              return now < start;
            }
            return true;
          } catch { return true; }
        });
      } else {
        // If Specific category, filter by subCategory field
        result = result.filter(e => e.subCategory?.toLowerCase() === activeSubTab.toLowerCase());
      }
    }

    // 3. Detailed Filters (Sidebar)
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(e => e.title.toLowerCase().includes(q) || e.venue?.name?.toLowerCase().includes(q) || e.venue?.city?.toLowerCase().includes(q));
    }
    if (filters.location) {
      const q = filters.location.toLowerCase();
      result = result.filter(e => e.venue?.name?.toLowerCase().includes(q) || e.venue?.city?.toLowerCase().includes(q));
    }
    if (!filters.access.public) result = result.filter(e => e.accessType !== 'public');
    if (!filters.access.private) result = result.filter(e => e.accessType !== 'private');
    if (!filters.price.free) result = result.filter(e => e.price.toLowerCase() === 'free');
    if (!filters.price.paid) result = result.filter(e => e.price.toLowerCase() !== 'free');

    // Date Logic (Simplified)
    if (filters.dateRange !== 'any') {
      // ... (Reusing existing date logic)
      result = result.filter(e => {
        const d = new Date(e.date);
        if (isNaN(d.getTime())) return false;
        if (filters.dateRange === 'today') return d.getDate() === now.getDate();
        // ... add more as needed
        return true;
      });
    }

    return result;
  }, [events, filters, activeSubTab]);

  return (
    <div id="events-section" className="min-h-screen bg-dark flex flex-col md:flex-row">

      {/* Left Navigation Sidebar (Category Profiles) */}
      <div className="w-full md:w-64 lg:w-72 md:h-screen md:sticky md:top-20 bg-secondary border-b md:border-b-0 md:border-r rounded-xl border-white/5 shrink-0 z-20 relative flex flex-col">

        {/* Fade Overlay for Mobile Scroll Hint */}
        <div className="absolute top-0 right-0 bottom-0 w-12 bg-gradient-to-l from-card to-transparent pointer-events-none md:hidden z-10" />

        <div className="w-full overflow-x-auto md:overflow-y-auto scrollbar-hide p-4 md:p-6">

          <div className="flex md:flex-col items-center md:items-stretch gap-4 md:gap-2">
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest hidden md:block mb-4">Categories</h3>

            {/* Mobile: Horizontal List, Desktop: Vertical List */}
            <div className="flex md:flex-col gap-2 pr-8 md:pr-0 min-w-max md:min-w-0">
              {CATEGORY_PROFILES.map((profile) => (
                <button
                  key={profile.id}
                  onClick={() => {
                    onCategoryChange(profile.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`flex items-center gap-2 md:gap-3 p-2 md:p-3 rounded-xl transition-all whitespace-nowrap ${activeProfileId === profile.id ? 'bg-primary text-black font-bold shadow-lg shadow-primary/20' : 'text-text-secondary hover:text-white hover:bg-white/5'}`}
                >
                  <profile.icon size={18} className="md:w-5 md:h-5" />
                  <span className="text-sm md:text-base">{profile.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 mt-6 md:mt-0 md:ml-6">

        {/* Dynamic Profile Header */}
        <div className="relative h-64 overflow-hidden group rounded-xl">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
            style={{ backgroundImage: `url(${currentProfile.banner})` }}
          />
          <div className={`absolute inset-0 bg-gradient-to-r ${currentProfile.gradient} via-dark/80 to-dark`} />
          <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent" />                <div className="absolute bottom-0 left-0 p-4 md:p-8 z-10">
            <div className={`flex items-center gap-2 ${currentProfile.color} font-bold uppercase tracking-widest text-[10px] md:text-xs mb-2 animate-in slide-in-from-left-4 fade-in duration-500`}>
              <currentProfile.icon size={14} className="md:w-4 md:h-4" /> {currentProfile.label} Hub
            </div>
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-2 animate-in slide-in-from-left-4 fade-in duration-700 delay-100">
              {currentProfile.label}
            </h1>
            <p className="text-gray-300 text-xs md:text-sm max-w-xl animate-in slide-in-from-left-4 fade-in duration-900 delay-200">
              {currentProfile.description} • {filteredEvents.length} Events Found
            </p>
          </div>
        </div>

        {/* Sub Tabs Navigation */}

        <div className="sticky top-20 z-30 bg-dark/95 backdrop-blur-xl border-b border-white/5 flex items-center relative">
          {/* Fade Overlay for Mobile */}
          <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-l from-dark to-transparent pointer-events-none md:hidden z-40" />

          <div className="flex items-center gap-2 px-8 py-4 overflow-x-auto scrollbar-hide w-full pr-12 md:pr-8">
            {currentProfile.subTabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveSubTab(tab)}
                className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${activeSubTab === tab ? `bg-white text-black border-white` : 'bg-transparent text-text-secondary border-white/10 hover:text-white hover:border-white/30'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>



        {/* Results */}
        <div className="p-4 md:p-8">
          {isFilterOpen && (
            <div className="mb-8 p-6 bg-card border border-white/10 rounded-2xl animate-in fade-in slide-in-from-top-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-white">Refine Search</h3>
                <button onClick={() => setIsFilterOpen(false)}><X size={20} className="text-muted/80 hover:text-white" /></button>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Simplified version of FilterSidebar just for context */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted/80" size={16} />
                  <input
                    placeholder="Search keywords..."
                    className="w-full bg-black/40 border border-white/10 rounded-lg p-2 pl-9 text-white focus:border-primary/50 outline-none"
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  />
                </div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted/80" size={16} />
                  <select
                    className="w-full bg-black/40 border border-white/10 rounded-lg p-2 pl-9 text-white focus:border-primary/50 outline-none appearance-none"
                    value={filters.location}
                    onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                  >
                    <option value="">All Locations</option>
                    {availableLocations.map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>
                {/* Add more inputs if needed, or rely on side modal for mobile */}
              </div>
            </div>
          )}

          <EventGrid
            events={filteredEvents}
            loading={loading}
            onEventClick={onEventClick}
          />

          {!loading && filteredEvents.length === 0 && (
            <div className="text-center py-20 opacity-50">
              <p className="text-xl font-bold">No events found in this category.</p>
              <button onClick={() => { setActiveSubTab('All'); setFilters(f => ({ ...f, search: '', location: '' })) }} className="text-primary mt-2 hover:underline">Clear Filters</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};