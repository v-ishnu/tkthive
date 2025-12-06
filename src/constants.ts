
import { EventData } from "./types";

export const MOCK_EVENTS: EventData[] = [
  {
    id: '1',
    title: 'Sunburn Arena ft. DJ Snake',
    date: 'Fri, Nov 24, 2025, 20:00',
    venue: 'Jio World Garden, Mumbai',
    description: 'India\'s biggest electronic music experience featuring top DJs from around the globe.',
    imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070&auto=format&fit=crop',
    price: '₹2,499',
    category: 'Music',
    accessType: 'public',
    featured: true,
    organizer: {
        name: "Sunburn Festival",
        imageUrl: "https://randomuser.me/api/portraits/men/32.jpg",
        description: "Asia's Premiere Electronic Dance Music Festival."
    },
    isLive: false,
    subEvents: [
      { id: 's1', time: '16:00', title: 'Gates Open', description: 'Entry starts for all ticket holders' },
      { id: 's2', time: '18:00', title: 'Opening Act: Anish Sood', description: 'Warm up beats' },
      { id: 's3', time: '20:00', title: 'Main Event: DJ Snake', description: 'The headliner takes the stage' }
    ],
    guests: [
      { name: "DJ Snake", role: "Headliner", imageUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop" }
    ],
    sponsors: [{ name: "Kingfisher", logoUrl: "", tier: "Platinum" }],
    ticketTiers: [
      { id: 't1', name: 'General Admission', price: '₹2,499', type: 'individual', description: 'Standard entry to the festival ground.' },
      { id: 't2', name: 'VIP Pit', price: '₹6,000', type: 'individual', description: 'Front row access + 2 drink coupons.' }
    ]
  },
  {
    id: '10',
    title: 'India Game Developers Conference 2025',
    date: 'Sat, Aug 15, 2025, 09:00',
    venue: 'HICC, Hyderabad',
    description: `Experience the convergence of next-gen technology and competitive gaming at India's premier expo. 
    
    IGDC is not just an event; it is a glimpse into tomorrow. Spanning over 100,000 square feet of exhibition space in Hyderabad, attendees will witness live demonstrations of breakthrough AI, VR haptics, and quantum computing interfaces.
    
    For the competitive souls, the "Arena" will host the Season 5 National Finals of 'Valorant', featuring the top 8 teams from around the country battling for a massive prize pool.
    
    Attendees get exclusive access to:
    - Hands-on demos of unreleased indie games
    - Developer workshops
    - Meet & Greet with industry legends
    - The legendary After-Party.`,
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2070&auto=format&fit=crop',
    price: '₹999 - ₹4,999',
    category: 'Tech',
    accessType: 'public',
    featured: true,
    organizer: {
        name: "IGDC Team",
        imageUrl: "https://randomuser.me/api/portraits/women/44.jpg",
        description: "Connecting the Indian gaming ecosystem."
    },
    isLive: true,
    subEvents: [
      { id: 's1', time: '09:00 AM', title: 'Opening Keynote: Gaming in India', description: 'Industry leaders discuss the future.' },
      { id: 's2', time: '11:00 AM', title: 'Valorant Tournament: Quarter Finals', description: 'Global Esports vs. Enigma Gaming.' },
      { id: 's3', time: '01:00 PM', title: 'Networking Lunch', description: 'Catered lunch at the food court.' },
      { id: 's4', time: '03:00 PM', title: 'Unity Workshop', description: 'Learn how to build immersive experiences.' },
      { id: 's5', time: '06:00 PM', title: 'Grand Finals & Closing Ceremony', description: 'The ultimate showdown.' }
    ],
    prizes: [
      { place: "1st Place", amount: "₹40,00,000", description: "Championship Trophy" },
      { place: "2nd Place", amount: "₹20,00,000", description: "Silver Medal" },
      { place: "3rd Place", amount: "₹10,00,000", description: "Bronze Medal" }
    ],
    guests: [
        { name: "Mortal", role: "Special Guest", imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=400&fit=crop" },
        { name: "CarryMinati", role: "Creator", imageUrl: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=400&h=400&fit=crop" }
    ],
    sponsors: [
        { name: "NVIDIA", logoUrl: "", tier: "Titanium" },
        { name: "Red Bull", logoUrl: "", tier: "Platinum" },
        { name: "Samsung", logoUrl: "", tier: "Gold" }
    ],
    results: [
        { winner: "Global Esports", score: "2 - 1", details: "Quarter Finals Match 1" },
        { winner: "GodLike", score: "2 - 0", details: "Quarter Finals Match 2" }
    ],
    ticketTiers: [
        { id: 't1', name: 'General Pass', price: '₹999', type: 'individual', description: 'Full access to expo floor and keynotes.' },
        { id: 't2', name: 'VIP All-Access', price: '₹4,999', type: 'individual', description: 'Priority entry, lounge access, and after-party ticket.' },
        { id: 't3', name: 'Squad Pack (5 Players)', price: '₹4,000', type: 'group', maxMembers: 5, description: 'Discounted rate for teams.' }
    ],
    registrationFields: [
        { id: 'f1', label: 'Gamer Tag', type: 'text', required: true },
        { id: 'f2', label: 'Discord Username', type: 'text', required: false },
        { id: 'f3', label: 'T-Shirt Size', type: 'select', options: ['S', 'M', 'L', 'XL', 'XXL'], required: true }
    ]
  },
  {
    id: '2',
    title: 'IIT Bombay Alumni Meetup',
    date: 'Mon, Dec 1, 2025, 18:00',
    venue: 'Taj Lands End, Mumbai',
    description: 'Exclusive networking event for alumni. Dress code: Formal.',
    imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=2069&auto=format&fit=crop',
    price: 'Free',
    category: 'Networking',
    accessType: 'private',
    organizer: {
        name: "IITBAA",
        imageUrl: "https://randomuser.me/api/portraits/men/88.jpg",
        description: "Official alumni association."
    },
    organization: 'IIT Bombay',
    subEvents: [],
    guests: [],
    ticketTiers: [
         { id: 't1', name: 'Alumni RSVP', price: 'Free', type: 'individual', description: 'Standard entry.' }
    ],
    registrationFields: [
        { id: 'f1', label: 'Graduation Year', type: 'text', required: true },
        { id: 'f2', label: 'Department', type: 'text', required: true }
    ]
  },
  {
    id: '3',
    title: 'Mahindra Blues Festival',
    date: 'Sat, Feb 15, 2026, 17:30',
    venue: 'Mehboob Studios, Mumbai',
    description: 'Asia\'s largest blues festival featuring legendary artists.',
    imageUrl: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?q=80&w=2070&auto=format&fit=crop',
    price: '₹3,500',
    category: 'Music',
    accessType: 'public',
    featured: true,
    organizer: {
        name: "Mahindra Group",
        imageUrl: "https://randomuser.me/api/portraits/women/65.jpg",
    },
    subEvents: [],
    ticketTiers: [
        { id: 't1', name: 'Day Pass', price: '₹3,500', type: 'individual', description: 'Access to all stages.' }
    ]
  },
  {
    id: '4',
    title: 'Bengaluru Tech Summit',
    date: 'Sun, Nov 29, 2025, 10:00',
    venue: 'Bangalore Palace, Bengaluru',
    description: 'India\'s flagship tech event for startups and innovation.',
    imageUrl: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=2070&auto=format&fit=crop',
    price: 'Free',
    category: 'Tech',
    accessType: 'public',
    organizer: {
        name: "Govt of Karnataka",
        imageUrl: "https://randomuser.me/api/portraits/men/12.jpg",
    },
    results: []
  },
  {
    id: '5',
    title: 'NH7 Weekender 2025',
    date: 'Fri, Dec 14, 2025, 15:00', 
    venue: 'Mahalakshmi Lawns, Pune',
    description: 'The happiest music festival.',
    imageUrl: 'https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=2070&auto=format&fit=crop',
    price: '₹4,000',
    category: 'Music',
    accessType: 'public',
    organizer: {
        name: "NODWIN Gaming",
        imageUrl: "https://randomuser.me/api/portraits/women/22.jpg",
    },
  },
  {
    id: '6',
    title: 'Shark Tank India Pitch Day',
    date: 'Thu, Mar 20, 2026, 17:30', 
    venue: 'Film City, Mumbai',
    description: 'Watch startups pitch live to the sharks.',
    imageUrl: 'https://images.unsplash.com/photo-1559223607-a43c990ed9aa?q=80&w=2074&auto=format&fit=crop',
    price: '₹1,500',
    category: 'Business',
    accessType: 'public',
    isLive: true,
    organizer: {
        name: "Sony LIV",
        imageUrl: "https://randomuser.me/api/portraits/men/5.jpg",
    },
  },
  {
    id: '7',
    title: 'Valorant India Invitational',
    date: 'Today, 20:00',
    venue: 'Online',
    description: 'National Championship Finals.',
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop',
    price: 'Free',
    category: 'Gaming',
    accessType: 'public',
    isLive: true,
    featured: true,
    organizer: {
        name: "Riot Games India",
        imageUrl: "https://randomuser.me/api/portraits/men/44.jpg",
    },
  },
  {
    id: '8',
    title: 'Jaipur Literature Festival',
    date: 'Sat, Jan 25, 2026, 11:00',
    venue: 'Diggi Palace, Jaipur',
    description: 'The greatest literary show on Earth.',
    imageUrl: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=2080&auto=format&fit=crop',
    price: '₹500',
    category: 'Art',
    accessType: 'public',
    organizer: {
        name: "Teamwork Arts",
        imageUrl: "https://randomuser.me/api/portraits/women/90.jpg",
    },
  },
  {
    id: '9',
    title: 'Tata Mumbai Marathon 2026',
    date: 'Sun, Jan 18, 2026, 05:00',
    venue: 'CSMT, Mumbai',
    description: 'Annual international marathon. Run for a cause.',
    imageUrl: 'https://images.unsplash.com/photo-1552674605-4696c2458404?q=80&w=2070&auto=format&fit=crop',
    price: '₹1,200',
    category: 'Sports',
    accessType: 'public',
    organizer: {
        name: "Procam International",
        imageUrl: "https://randomuser.me/api/portraits/men/29.jpg",
    },
  }
];

export const POPULAR_CITIES = [
  { city: 'Mumbai', country: 'India' },
  { city: 'Delhi', country: 'India' },
  { city: 'Bengaluru', country: 'India' },
  { city: 'Hyderabad', country: 'India' },
  { city: 'Chennai', country: 'India' },
  { city: 'Pune', country: 'India' },
  { city: 'Kolkata', country: 'India' },
  { city: 'Goa', country: 'India' },
];
