

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

export interface RegistrationFormField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'select' | 'url' | 'number' | 'textarea';
  options?: string[]; // For select
  required: boolean;
  placeholder?: string;
  scope?: 'booking' | 'attendee'; // 'booking' = asked once (e.g. Team Name), 'attendee' = asked for each person (e.g. T-Shirt Size)
}

export interface TicketTier {
  id: string;
  name: string;
  price: string;
  type: 'individual' | 'group';
  maxMembers?: number; // e.g., 5 for a team
  description?: string;
  // Custom fields specific to this ticket type (e.g. Song Name for singing, Github for coding)
  requiredFields?: RegistrationFormField[];
}

export interface AddOn {
  id: string;
  name: string;
  price: string;
  description?: string;
  imageUrl?: string;
  type: 'merch' | 'meal' | 'access' | 'other';
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
  subCategory?: string;
  sourceUrl?: string;
  accessType?: 'public' | 'private';

  organizer: Organizer;

  organization?: string;
  subEvents?: SubEvent[];

  isLive?: boolean;
  prizes?: Prize[];
  guests?: Guest[];
  sponsors?: Sponsor[];
  results?: EventResult[];
  liveStreamUrl?: string;

  // Registration Constraints
  maxTicketsPerUser?: number; // e.g., 1 for strict contests
  ticketTiers?: TicketTier[];
  addOns?: AddOn[];

  featured?: boolean;
}

export interface LocationData {
  city: string;
  country: string;
  imageUrl?: string;
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface AttendeeDetail {
  name: string;
  email: string;
  phone?: string;
  customData?: Record<string, string>;
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
  attendeeDetails?: AttendeeDetail[];
  seat?: string;
  row?: string;
  status?: 'upcoming' | 'completed' | 'expired';
  customData?: Record<string, string>; // Booking level custom data
}

export interface User {
  name: string;
  email: string;
  avatar: string;
  phone?: string;
  role?: 'Member' | 'Pro' | 'Organizer';
  coverImage?: string;
  location?: string;
  stats?: {
    events: number;
    followers: number;
    following: number;
  };
  tickets: Ticket[];
}