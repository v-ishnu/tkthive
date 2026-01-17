
export interface SubEvent {
  id: string;
  title: string;
  time: string;
  date: string; // Added date for scheduling
  description?: string;
  location?: string;
  type?: 'keynote' | 'workshop' | 'panel' | 'networking' | 'other';
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
  bio?: string;
}

export interface Sponsor {
  name: string;
  tkthiveUrl: string;
  tier?: string; // e.g., "Platinum", "Gold"
}

export interface EventResult {
  winner: string;
  score?: string;
  details?: string;
}

export interface EventDoc {
  id: string;
  title: string;
  url: string;
  type: 'pdf' | 'link' | 'image' | 'other';
  description?: string;
}

export interface Submission {
  id: string;
  title: string;
  description: string;
  teamName?: string;
  links: { label: string; url: string }[];
  submittedBy: {
    name: string;
    avatar?: string;
  };
  submittedAt: string;
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
  minMembers?: number; // e.g., 2 for a team
  description?: string;
  validDate?: string; // Specific date validity
  validTime?: string; // Specific time validity
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
  contactEmail?: string;
  contactPhone?: string;
  website?: string;
}

export interface Venue {
  name: string;
  city: string;
  state?: string;
  country?: string;
  pincode?: string;
  latitude?: number;
  longitude?: number;
}


export interface EventTab {
  id: string;
  key: string;
  title: string;
  schema?: any; // Define clearer schema if possible
  data?: any;
  order: number;
  isActive?: boolean;
}

export interface EventData {
  id: string;
  slug?: string; // Added slug
  title: string;
  date: string; // Display date range string e.g. "Oct 12-14, 2026"
  venue: Venue;
  description: string;
  imageUrl: string;
  price: string;
  category?: 'TECH' | 'ESPORTS' | 'SPORTS' | 'ARTS' | 'FEST' | 'CONCERT' | 'OTHERS' | string;
  subCategory?: string;
  sourceUrl?: string;
  accessType?: 'public' | 'private';

  organizer: Organizer;

  organization?: string;
  subEvents?: SubEvent[];
  documents?: EventDoc[];
  submissions?: Submission[];

  isLive?: boolean;
  prizes?: Prize[];
  guests?: Guest[];
  sponsors?: Sponsor[];
  results?: EventResult[];
  liveStreamUrl?: string;

  tabs?: EventTab[]; // Added tabs

  // Registration Constraints
  maxTicketsPerUser?: number; // e.g., 1 for strict contests
  ticketTiers?: TicketTier[];
  addOns?: AddOn[];


  featured?: boolean;
  allowSubmissions?: boolean;
  customFields?: RegistrationFormField[]; // Global event-level custom fields

  // New Fields
  info?: string;
  announcement?: string;
  isOnline?: boolean;
  isPrivate?: boolean;
  isRegistrationOpen?: boolean;
  totalBooked?: number;
  totalTickets?: number;
  showevent?: boolean; // ✅ Added
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
  validDate?: string;
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