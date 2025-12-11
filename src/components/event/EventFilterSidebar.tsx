
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



