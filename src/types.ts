
export interface SubEvent {
  id: string;
  title: string;
  time: string;
  description?: string;
}

export interface Prize {
  place: string; // e.g., "1st Place"
  amount: string; // e.g., "$10,000"
  description?: string; // e.g., "Cash + Trophy"
}

export interface Guest {
  name: string;
  role: string; // e.g., "Keynote Speaker", "DJ"
  imageUrl?: string;
}

export interface Sponsor {
  name: string;
  logoUrl: string;
  tier?: string; // e.g., "Platinum", "Gold"
}

export interface EventResult {
  winner: string;
  score?: string;
  details?: string;
}

export interface TicketTier {
  id: string;
  name: string;
  price: string;
  type: 'individual' | 'group';
  maxMembers?: number; // e.g., 5 for a team
  description?: string;
}

export interface RegistrationFormField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'select';
  options?: string[];
  required: boolean;
}

export interface Organizer {
    name: string;
    imageUrl?: string;
    description?: string;
}

export interface EventData {
  id: string;
  title: string;
  date: string;
  venue: string;
  description: string;
  imageUrl: string;
  price: string;
  category?: string;
  sourceUrl?: string; // For grounding
  accessType?: 'public' | 'private';
  
  organizer: Organizer; 

  organization?: string; 
  subEvents?: SubEvent[];
  
  // New fields for Tabs
  isLive?: boolean;
  prizes?: Prize[];
  guests?: Guest[];
  sponsors?: Sponsor[];
  results?: EventResult[];
  liveStreamUrl?: string;

  // New fields for Registration
  ticketTiers?: TicketTier[];
  registrationFields?: RegistrationFormField[];

  // Feature Flags
  featured?: boolean;
}

export interface LocationData {
  city: string;
  country: string;
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface Ticket {
  id: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventVenue: string;
  eventImage: string;
  ticketType: string;
  price: string;
  bookingDate: string;
  attendees: number;
  seat?: string;
  row?: string;
  status?: 'upcoming' | 'completed' | 'expired';
}

export interface User {
  name: string;
  email: string;
  avatar: string;
  phone?: string;
  tickets: Ticket[];
}