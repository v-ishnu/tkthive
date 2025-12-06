
import React from 'react';
import { Search, MapPin, Calendar, IndianRupee, Lock, Filter } from 'lucide-react';

export interface FilterState {
  search: string;
  location: string;
  dateRange: 'any' | 'today' | 'tomorrow' | 'weekend';
  price: {
    free: boolean;
    paid: boolean;
  };
  access: {
    public: boolean;
    private: boolean;
  };
  category: string;
}

interface EventsFilterSidebarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  categories: string[];
}

export const EventsFilterSidebar: React.FC<EventsFilterSidebarProps> = ({ filters, setFilters }) => {
  
  const handlePriceChange = (type: 'free' | 'paid') => {
    setFilters(prev => ({
      ...prev,
      price: { ...prev.price, [type]: !prev.price[type] }
    }));
  };

  const handleAccessChange = (type: 'public' | 'private') => {
    setFilters(prev => ({
      ...prev,
      access: { ...prev.access, [type]: !prev.access[type] }
    }));
  };

  return (
    <div className="bg-card border border-white/10 rounded-3xl p-6 space-y-8">
      <div className="flex items-center gap-2 text-white font-bold text-lg mb-2">
        <Filter className="text-primary" size={20} />
        Filters
      </div>

      {/* Search & Location */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <input 
            type="text" 
            placeholder="Search events..." 
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:border-primary/50 outline-none"
          />
        </div>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <input 
            type="text" 
            placeholder="Filter location..." 
            value={filters.location}
            onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
            className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:border-primary/50 outline-none"
          />
        </div>
      </div>

      {/* Date Filter */}
      <div>
        <h4 className="flex items-center gap-2 text-gray-300 font-bold text-sm uppercase tracking-wider mb-4">
          <Calendar size={14} /> Date
        </h4>
        <div className="space-y-2">
          {['any', 'today', 'tomorrow', 'weekend'].map((option) => (
            <label key={option} className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${filters.dateRange === option ? 'border-primary' : 'border-gray-600 group-hover:border-gray-400'}`}>
                {filters.dateRange === option && <div className="w-2 h-2 rounded-full bg-primary" />}
              </div>
              <input 
                type="radio" 
                name="dateRange" 
                className="hidden" 
                checked={filters.dateRange === option}
                onChange={() => setFilters(prev => ({ ...prev, dateRange: option as any }))}
              />
              <span className={`text-sm capitalize transition-colors ${filters.dateRange === option ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'}`}>
                {option === 'any' ? 'Any Date' : option === 'weekend' ? 'This Weekend' : option}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Filter */}
      <div>
        <h4 className="flex items-center gap-2 text-gray-300 font-bold text-sm uppercase tracking-wider mb-4">
          <IndianRupee size={14} /> Price
        </h4>
        <div className="space-y-2">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${filters.price.free ? 'bg-primary border-primary' : 'border-gray-600 group-hover:border-gray-400'}`}>
              {filters.price.free && <svg className="w-3 h-3 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
            </div>
            <input type="checkbox" className="hidden" checked={filters.price.free} onChange={() => handlePriceChange('free')} />
            <span className="text-sm text-gray-400 group-hover:text-white transition-colors">Free</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${filters.price.paid ? 'bg-primary border-primary' : 'border-gray-600 group-hover:border-gray-400'}`}>
               {filters.price.paid && <svg className="w-3 h-3 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
            </div>
            <input type="checkbox" className="hidden" checked={filters.price.paid} onChange={() => handlePriceChange('paid')} />
            <span className="text-sm text-gray-400 group-hover:text-white transition-colors">Paid</span>
          </label>
        </div>
      </div>

      {/* Access Filter */}
      <div>
        <h4 className="flex items-center gap-2 text-gray-300 font-bold text-sm uppercase tracking-wider mb-4">
          <Lock size={14} /> Access
        </h4>
        <div className="space-y-2">
           <label className="flex items-center gap-3 cursor-pointer group">
            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${filters.access.public ? 'bg-primary border-primary' : 'border-gray-600 group-hover:border-gray-400'}`}>
               {filters.access.public && <svg className="w-3 h-3 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
            </div>
            <input type="checkbox" className="hidden" checked={filters.access.public} onChange={() => handleAccessChange('public')} />
            <span className="text-sm text-gray-400 group-hover:text-white transition-colors">Public</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${filters.access.private ? 'bg-primary border-primary' : 'border-gray-600 group-hover:border-gray-400'}`}>
               {filters.access.private && <svg className="w-3 h-3 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
            </div>
            <input type="checkbox" className="hidden" checked={filters.access.private} onChange={() => handleAccessChange('private')} />
            <span className="text-sm text-gray-400 group-hover:text-white transition-colors">Private</span>
          </label>
        </div>
      </div>
    </div>
  );
};
