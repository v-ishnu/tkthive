

import { EventData } from "./types";

export const MOCK_EVENTS: EventData[] = [
    // =================================================================
    // NEW: MAJOR DUMMY EVENT (HYBRID & COMPLEX)
    // =================================================================
    {
        id: 'global-innovators-2026',
        title: 'Global Innovators Summit 2026',
        date: 'Fri, May 15, 2026, 10:00',
        venue: { name: 'Online & Multiple Hubs', city: 'Multiple' },
        description: 'The world\'s premier hybrid conference for creators, builders, and dreamers. Join 50,000+ attendees globally for keynotes, workshops, and immersive networking.',
        imageUrl: 'https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=2070&auto=format&fit=crop',
        price: '₹1,500 - ₹25,000',
        category: 'Innovation',
        subCategory: 'Hybrid Summit',
        accessType: 'public',
        featured: true,
        allowSubmissions: true,
        organizer: {
            name: "Future World Alliance",
            imageUrl: "https://ui-avatars.com/api/?name=Future+World&background=7c3aed&color=fff",
            description: "Connecting minds across borders."
        },
        subEvents: [
            { id: 'se1', title: 'Global Keynote', time: '10:00 AM (GMT)', date: '2026-05-15', description: 'Broadcast live from London HQ.' },
            { id: 'se2', title: 'Regional Breakouts', time: '02:00 PM (Local)', date: '2026-05-15', description: 'Networking in your selected hub.' },
            { id: 'se3', title: 'Virtual Metaverse Party', time: '08:00 PM (GMT)', date: '2026-05-15', description: 'Join via VR or WebGL.' }
        ],
        documents: [
            { id: 'doc1', title: 'Event Agenda', url: 'https://example.com/agenda.pdf', type: 'pdf', description: 'Detailed schedule of all sessions.' },
            { id: 'doc2', title: 'Code of Conduct', url: 'https://example.com/coc', type: 'link', description: 'Community guidelines.' }
        ],
        submissions: [
            {
                id: 'sub1',
                title: 'Project Alpha',
                description: 'An AI-driven sustainability platform.',
                links: [{ label: 'Demo', url: 'https://demo.com' }, { label: 'GitHub', url: 'https://github.com' }],
                submittedBy: { name: 'Alice Chen', avatar: 'https://ui-avatars.com/api/?name=Alice+Chen' },
                submittedAt: '2026-05-10'
            },
            {
                id: 'sub2',
                title: 'Urban Flow',
                description: 'Smart city traffic management solution.',
                links: [{ label: 'Pitch Deck', url: 'https://slides.com' }],
                submittedBy: { name: 'Bob Smith', avatar: 'https://ui-avatars.com/api/?name=Bob+Smith' },
                submittedAt: '2026-05-12'
            }
        ],
        guests: [
            { name: "Elon Musk", role: "Visionary", imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop" },
            { name: "Sam Altman", role: "AI Lead", imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop" }
        ],
        sponsors: [
            { name: "OpenAI", tkthiveUrl: "", tier: "Platinum" },
            { name: "Meta", tkthiveUrl: "", tier: "Gold" }
        ],
        ticketTiers: [
            {
                id: 'virtual_pass',
                name: 'Global Virtual Pass',
                price: '₹1,500',
                type: 'individual',
                description: 'Access to all livestreams and metaverse.',
                requiredFields: [
                    { id: 'email', label: 'Registered Email', type: 'email', required: true, scope: 'booking' }
                ]
            },
            {
                id: 'hub_pass',
                name: 'Physical Hub Access',
                price: '₹5,000',
                type: 'individual',
                description: 'Attend in-person at your nearest hub (Lunch included).',
                requiredFields: [
                    { id: 'hub_loc', label: 'Select Hub Location', type: 'select', options: ['London', 'New York', 'Bengaluru', 'Tokyo'], required: true, scope: 'booking' },
                    { id: 'diet', label: 'Dietary Preference', type: 'text', required: false, scope: 'attendee' }
                ]
            },
            {
                id: 'startup_booth',
                name: 'Startup Demo Booth',
                price: '₹25,000',
                type: 'group',
                maxMembers: 3,
                description: 'Physical booth at one hub + 3 exhibitor passes.',
                requiredFields: [
                    { id: 'startup_name', label: 'Startup Name', type: 'text', required: true, scope: 'booking' },
                    { id: 'deck', label: 'Pitch Deck URL', type: 'url', required: true, scope: 'booking' },
                    { id: 'hub_loc', label: 'Booth Location', type: 'select', options: ['London', 'New York', 'Bengaluru'], required: true, scope: 'booking' }
                ]
            }
        ],
        addOns: [
            { id: 'rec', name: 'Lifetime Recordings', price: '₹999', description: 'Access to all sessions forever.', type: 'access' },
            { id: 'mentor', name: '1:1 Mentorship Slot', price: '₹2,500', description: '30 mins with industry leader.', type: 'access' }
        ]
    },
    // =================================================================
    // TECH & CODING
    // =================================================================
    {
        id: 'cosmos-tech-2025',
        title: 'Cosmos TechFest 2025',
        date: 'Fri, Nov 24, 2026, 09:00',
        venue: { name: 'IIT Delhi', city: 'New Delhi' },
        description: 'The ultimate collegiate technical festival. 48 hours of code, design, and innovation.',
        imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop',
        price: '₹500 - ₹2000',
        category: 'Tech',
        subCategory: 'Hackathon',
        accessType: 'public',
        featured: true,
        organizer: {
            name: "Cosmos Council",
            imageUrl: "https://ui-avatars.com/api/?name=Cosmos+Council&background=6366f1&color=fff",
            description: "Fostering innovation since 2010."
        },
        subEvents: [
            { id: 's1', title: 'Opening Ceremony', time: '09:00 AM', date: '2026-11-24', description: 'Inauguration by Minister of IT.' },
            { id: 's2', title: 'Hackathon Begins', time: '11:00 AM', date: '2026-11-24', description: 'Problem statements released.' }
        ],
        ticketTiers: [
            {
                id: 'hack_squad',
                name: 'Hackathon Squad (4 Pax)',
                price: '₹2,000',
                type: 'group',
                maxMembers: 4,
                description: 'Team entry for the main hackathon track.',
                requiredFields: [
                    // Booking Scoped (Ask Once)
                    { id: 'team_name', label: 'Team Name', type: 'text', required: true, scope: 'booking', placeholder: 'e.g. The Bug Slayers' },
                    { id: 'project_track', label: 'Preferred Track', type: 'select', options: ['AI/ML', 'Web3', 'Open Innovation'], required: true, scope: 'booking' },

                    // Attendee Scoped (Ask for EACH member)
                    { id: 'tshirt', label: 'T-Shirt Size', type: 'select', options: ['S', 'M', 'L', 'XL'], required: true, scope: 'attendee' },
                    { id: 'discord', label: 'Discord ID', type: 'text', required: true, scope: 'attendee', placeholder: 'user#1234' },
                    { id: 'reg_no', label: 'College Reg No', type: 'text', required: true, scope: 'attendee', placeholder: 'ID Number' }
                ]
            },
            {
                id: 'workshop_solo',
                name: 'AI Workshop Pass',
                price: '₹500',
                type: 'individual',
                description: 'Entry to 1-day AI workshop only.',
                requiredFields: [
                    { id: 'laptop_model', label: 'Laptop Model', type: 'text', required: false, scope: 'booking', placeholder: 'MacBook Air M1' }
                ]
            }
        ],
        prizes: [
            { place: "1st Prize", amount: "₹1,00,000", description: "Cash + Internship" },
            { place: "2nd Prize", amount: "₹50,000", description: "Cash + Goodies" }
        ]
    },
    {
        id: 'blr-tech-1',
        title: 'India Dev Summit 2025',
        date: 'Fri, Nov 14, 2026, 09:00',
        venue: { name: 'Bangalore International Exhibition Centre', city: 'Bengaluru' },
        description: 'The largest gathering of developers, startups, and tech giants in South Asia. Join 10,000+ engineers for 3 days of innovation.',
        imageUrl: 'https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=2070&auto=format&fit=crop',
        price: '₹2,999',
        category: 'Tech',
        subCategory: 'Summit',
        accessType: 'public',
        featured: true,
        organizer: {
            name: "TechIndia Foundation",
            imageUrl: "https://ui-avatars.com/api/?name=Tech+India&background=0D8ABC&color=fff",
            description: "Empowering India's digital future."
        },
        subEvents: [
            { id: 's1', title: 'Keynote: Future of AI', time: '09:00 AM', date: '2026-11-14', description: 'Sundar Pichai on the next wave of Generative AI.' },
            { id: 's2', title: 'Panel: Web3 in 2026', time: '11:30 AM', date: '2026-11-14', description: 'Is the hype real? Industry experts debate.' },
            { id: 's3', title: 'Networking Lunch', time: '01:00 PM', date: '2026-11-14', description: 'Meet potential co-founders and investors.' },
            { id: 's4', title: 'Workshop: Rust for JS Devs', time: '02:30 PM', date: '2026-11-14', description: 'Hands-on session with principal engineers.' }
        ],
        guests: [
            { name: "Satya Nadella", role: "Keynote Speaker", imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop" },
            { name: "Mira Murati", role: "AI Innovator", imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop" },
            { name: "Nithin Kamath", role: "Fintech Pioneer", imageUrl: "https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=400&auto=format&fit=crop" }
        ],
        sponsors: [
            { name: "Google Cloud", tkthiveUrl: "", tier: "Platinum" },
            { name: "AWS", tkthiveUrl: "", tier: "Platinum" },
            { name: "Postman", tkthiveUrl: "", tier: "Gold" }
        ],
        ticketTiers: [
            {
                id: 'dev_early',
                name: 'Early Bird Developer',
                price: '₹2,999',
                type: 'individual',
                description: 'Full 3-day access + Swag Kit.',
                requiredFields: [
                    { id: 'company', label: 'Company / College Name', type: 'text', required: true, scope: 'booking', placeholder: 'e.g. Google or IIT Bombay' },
                    { id: 'role', label: 'Job Role', type: 'text', required: true, scope: 'booking', placeholder: 'e.g. Senior Engineer' },
                    { id: 'tshirt', label: 'T-Shirt Size', type: 'select', options: ['S', 'M', 'L', 'XL', 'XXL'], required: true, scope: 'attendee' }
                ]
            },
            {
                id: 'vip_exec',
                name: 'VIP Executive',
                price: '₹12,000',
                type: 'individual',
                description: 'Backstage access, Speaker Dinner & VIP Lounge.',
                requiredFields: [
                    { id: 'linkedin', label: 'LinkedIn Profile', type: 'url', required: true, scope: 'booking', placeholder: 'https://linkedin.com/in/...' },
                    { id: 'diet', label: 'Dietary Restrictions', type: 'text', required: false, scope: 'attendee', placeholder: 'e.g. Vegan, Gluten-free' }
                ]
            }
        ],
        addOns: [
            { id: 'a1', name: 'Certified Workshop Pass', price: '₹1,500', description: 'Add-on for deep-dive sessions.', type: 'access', imageUrl: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=200&auto=format&fit=crop" },
            { id: 'a2', name: 'Premium Lunch Buffet', price: '₹800', description: '3-Day meal pass.', type: 'meal', imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=200&auto=format&fit=crop" }
        ]
    },
    {
        id: 'hyd-hack-1',
        title: 'CyberHack 2025',
        date: 'Sat, Dec 10, 2026, 08:00',
        venue: { name: 'T-Hub', city: 'Hyderabad' },
        description: '36-hour non-stop hackathon building solutions for Cyber Security and Blockchain.',
        imageUrl: 'https://images.unsplash.com/photo-1504384308090-c54be3852f33?q=80&w=2070&auto=format&fit=crop',
        price: '₹500',
        category: 'Tech',
        subCategory: 'Hackathon',
        featured: true,
        organizer: { name: "CyberSec India" },
        maxTicketsPerUser: 1,
        prizes: [
            { place: "1st Prize", amount: "₹3,00,000", description: "Cash + Incubation Opportunity" },
            { place: "2nd Prize", amount: "₹1,50,000", description: "Cash + Cloud Credits" },
            { place: "Best Student Team", amount: "₹50,000", description: "Cash Prize" }
        ],
        ticketTiers: [
            {
                id: 'team_hack',
                name: 'Hacker Squad',
                price: '₹2,000', // 500 * 4
                type: 'group',
                maxMembers: 4,
                description: 'Registration fee for a team of 4.',
                requiredFields: [
                    { id: 'team_name', label: 'Team Name', type: 'text', required: true, scope: 'booking', placeholder: 'e.g. Binary Bandits' },
                    { id: 'github_lead', label: 'Team Lead GitHub', type: 'url', required: true, scope: 'booking', placeholder: 'https://github.com/...' },
                    { id: 'track', label: 'Preferred Track', type: 'select', options: ['FinTech', 'HealthTech', 'Web3', 'Open Innovation'], required: true, scope: 'booking' },
                    { id: 'project_idea', label: 'Brief Project Idea', type: 'textarea', required: true, scope: 'booking', placeholder: 'Describe what you plan to build...' }
                ]
            }
        ],
        addOns: [
            { id: 'redbull', name: 'RedBull 6-Pack', price: '₹600', description: 'Fuel for the night.', type: 'meal', imageUrl: "https://images.unsplash.com/photo-1620916297397-a4a5402a3c6c?q=80&w=200&auto=format&fit=crop" },
            { id: 'mattress', name: 'Sleeping Bag Rental', price: '₹300', description: 'Stay comfortable.', type: 'access' }
        ]
    },

    // =================================================================
    // ESPORTS & GAMING
    // =================================================================
    {
        id: 'mum-esports-1',
        title: 'Valorant Challengers League: South Asia Split',
        date: 'Sun, Oct 25, 2025, 16:00',
        venue: { name: 'NSCI Dome', city: 'Mumbai' },
        description: 'Witness the top teams in India battle for a slot in the Pacific Ascension.',
        imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop',
        price: '₹499',
        category: 'Esports',
        subCategory: 'LAN Event',
        isLive: false,
        featured: true,
        organizer: { name: "Nodwin Gaming", imageUrl: "https://ui-avatars.com/api/?name=Nodwin&background=FF0000&color=fff" },
        subEvents: [
            { id: 'match1', title: 'Semi Final 1', time: '04:00 PM', date: '2025-10-25', description: 'Global Esports vs Enigma Gaming' },
            { id: 'match2', title: 'Semi Final 2', time: '07:00 PM', date: '2025-10-25', description: 'GodLike vs Revenant' },
            { id: 'showmatch', title: 'Influencer Showmatch', time: '09:00 PM', date: '2025-10-25', description: 'Mortal & Scout Team Battle' }
        ],
        ticketTiers: [
            { id: 'ga', name: 'General Admission', price: '₹499', type: 'individual', description: 'Gallery seating.', requiredFields: [] },
            { id: 'premium', name: 'Premium Floor', price: '₹1,499', type: 'individual', description: 'Close to stage + Fan Sign access.', requiredFields: [] }
        ],
        addOns: [
            { id: 'jersey', name: 'Team Jersey (Random)', price: '₹899', description: 'Official jersey of a participating team.', type: 'merch', imageUrl: "https://images.unsplash.com/photo-1577213426189-d9a263673f32?q=80&w=200&auto=format&fit=crop" }
        ]
    },
    {
        id: 'online-scrim-1',
        title: 'BGMI Weekend Scrims - Tier 1',
        date: 'Today, 20:00',
        venue: { name: 'Online', city: 'Online' },
        description: 'High-level practice matches for invited underdog teams.',
        imageUrl: 'https://images.unsplash.com/photo-1593305841991-05c29736ce87?q=80&w=2070&auto=format&fit=crop',
        price: 'Free',
        category: 'Esports',
        subCategory: 'Scrims',
        isLive: true,
        organizer: { name: "Villager Esports" },
        ticketTiers: [
            {
                id: 'team_reg',
                name: 'Squad Entry',
                price: 'Free',
                type: 'group',
                maxMembers: 5,
                description: 'Invite only. Enter code sent to manager.',
                requiredFields: [
                    { id: 'team_name', label: 'Clan Name', type: 'text', required: true, scope: 'booking', placeholder: 'e.g. Soul' },
                    { id: 'invite_code', label: 'Invite Code', type: 'text', required: true, scope: 'booking' },
                    { id: 'discord_id', label: 'Manager Discord ID', type: 'text', required: true, scope: 'booking' },
                    { id: 'in_game_id', label: 'In-Game ID', type: 'text', required: true, scope: 'attendee' }
                ]
            }
        ]
    },

    // =================================================================
    // FESTIVALS (MUSIC & FOOD)
    // =================================================================
    {
        id: 'goa-sunburn-1',
        title: 'Sunburn Goa 2025',
        date: 'Dec 27 - 30, 2026',
        venue: { name: 'Vagator Beach', city: 'Goa' },
        description: 'Asia’s biggest electronic dance music festival. 4 Days of madness, music, and magic.',
        imageUrl: 'https://images.unsplash.com/photo-1459749411177-d2841fbd74e0?q=80&w=2070&auto=format&fit=crop',
        price: '₹8,000',
        category: 'Festival',
        subCategory: 'Music',
        featured: true,
        organizer: { name: "Percept Live" },
        guests: [
            { name: "Martin Garrix", role: "Headliner", imageUrl: "https://images.unsplash.com/photo-1516280440614-6697288d5d38?q=80&w=400&auto=format&fit=crop" },
            { name: "Hardwell", role: "Headliner", imageUrl: "https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?q=80&w=400&auto=format&fit=crop" },
            { name: "KSHMR", role: "Special Act", imageUrl: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=400&auto=format&fit=crop" }
        ],
        subEvents: [
            { id: 'd1', title: 'Day 1: The Awakening', time: '02:00 PM', date: '2026-12-27', description: 'Techno Stage opening.' },
            { id: 'd2', title: 'Day 2: Solar Power', time: '02:00 PM', date: '2026-12-28', description: 'Trance specials.' },
            { id: 'd3', title: 'Day 3: The Big Bang', time: '02:00 PM', date: '2026-12-29', description: 'Mainstage headliners.' }
        ],
        ticketTiers: [
            { id: 'ga_season', name: 'GA Season Pass (4 Days)', price: '₹8,000', type: 'individual', description: 'Access to all stages.', requiredFields: [{ id: 'age', label: 'Age Confirmation', type: 'select', options: ['I am 18+'], required: true, scope: 'booking' }] },
            { id: 'vip_season', name: 'VIP Season Pass', price: '₹14,000', type: 'individual', description: 'Elevated platforms, dedicated bars.', requiredFields: [{ id: 'age', label: 'Age Confirmation', type: 'select', options: ['I am 18+'], required: true, scope: 'booking' }] }
        ],
        addOns: [
            { id: 'camp', name: 'Camping Tent (2 Pax)', price: '₹10,000', description: 'Stay at the festival village.', type: 'access', imageUrl: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?q=80&w=500&auto=format&fit=crop" },
            { id: 'afterparty', name: 'Official Afterparty Pass', price: '₹2,000', description: 'Access to club events post 10 PM.', type: 'access' }
        ]
    },
    {
        id: 'delhi-food-1',
        title: 'The Great Indian Food Festival',
        date: 'Sat, Nov 08, 2026, 11:00',
        venue: { name: 'Jawaharlal Nehru Stadium', city: 'Delhi' },
        description: 'A culinary journey through India’s states. 500+ Dishes, 50+ Stalls.',
        imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1974&auto=format&fit=crop',
        price: '₹299',
        category: 'Festival',
        subCategory: 'Food',
        organizer: { name: "Delhi Food Walks" },
        ticketTiers: [
            { id: 'entry', name: 'Entry Pass', price: '₹299', type: 'individual', requiredFields: [] },
            { id: 'tasting', name: 'Taster Pass', price: '₹999', type: 'individual', description: 'Entry + 5 Food Coupons.', requiredFields: [] }
        ],
        addOns: [
            { id: 'beer', name: 'Beer Mug + Refill', price: '₹599', description: 'Keepsake mug + 1st fill free.', type: 'meal', imageUrl: "https://images.unsplash.com/photo-1571506538622-d3cf4eec01ae?q=80&w=200&auto=format&fit=crop" }
        ]
    },

    // =================================================================
    // SPORTS
    // =================================================================
    {
        id: 'mum-cricket-1',
        title: 'IPL 2026: Mumbai Indians vs CSK',
        date: 'Wed, Apr 15, 2026, 19:30',
        venue: { name: 'Wankhede Stadium', city: 'Mumbai' },
        description: 'The El Clasico of IPL. Rohit vs Dhoni (Legacy match).',
        imageUrl: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=2067&auto=format&fit=crop',
        price: '₹1,500',
        category: 'Sports',
        subCategory: 'Cricket',
        accessType: 'public',
        featured: true,
        organizer: { name: "BCCI / IPL" },
        ticketTiers: [
            { id: 'stand_g', name: 'Sunil Gavaskar Stand', price: '₹1,500', type: 'individual', description: 'Upper tier seating.', requiredFields: [] },
            { id: 'stand_s', name: 'Sachin Tendulkar Stand', price: '₹3,500', type: 'individual', description: 'Premium view behind bowler.', requiredFields: [] },
            { id: 'box', name: 'Corporate Box', price: '₹15,000', type: 'individual', description: 'AC Hospitality + Dinner.', requiredFields: [{ id: 'comp', label: 'Company Name', type: 'text', required: true, scope: 'booking' }] }
        ],
        addOns: [
            { id: 'jersey_mi', name: 'MI Official Jersey', price: '₹1,999', description: '2026 Season Kit.', type: 'merch', imageUrl: "https://images.unsplash.com/photo-1631194758628-71ec7c35137e?q=80&w=200&auto=format&fit=crop" },
            { id: 'flag', name: 'Team Flag', price: '₹200', description: 'Support your team.', type: 'merch' }
        ]
    },
    {
        id: 'kol-football-1',
        title: 'Kolkata Derby: Mohun Bagan vs East Bengal',
        date: 'Sun, Sep 20, 2025, 17:00',
        venue: { name: 'Salt Lake Stadium', city: 'Kolkata' },
        description: 'Asia’s oldest football rivalry. 80,000 fans, one passion.',
        imageUrl: 'https://images.unsplash.com/photo-1624880357913-a8539238245b?q=80&w=2070&auto=format&fit=crop',
        price: '₹200',
        category: 'Sports',
        subCategory: 'Football',
        organizer: { name: "IFA West Bengal" },
        ticketTiers: [
            { id: 'gen', name: 'General Gallery', price: '₹200', type: 'individual', requiredFields: [] },
            { id: 'vip', name: 'VIP Box', price: '₹1,000', type: 'individual', requiredFields: [] }
        ]
    },

    // =================================================================
    // ART & CULTURE
    // =================================================================
    {
        id: 'del-art-1',
        title: 'India Art Fair 2025',
        date: 'Thu, Feb 05, 2025, 10:00',
        venue: { name: 'NSIC Exhibition Grounds', city: 'Delhi' },
        description: 'Discover modern and contemporary art from South Asia.',
        imageUrl: 'https://images.unsplash.com/photo-1518998053901-5348d3969104?q=80&w=1974&auto=format&fit=crop',
        price: '₹600',
        category: 'Art',
        subCategory: 'Exhibition',
        organizer: { name: "India Art Fair" },
        subEvents: [
            { id: 'talk1', title: 'Curator Walkthrough', time: '11:00 AM', date: '2025-02-05', description: 'Guided tour of highlights.' },
            { id: 'perf', title: 'Live Performance Art', time: '04:00 PM', date: '2025-02-05', description: 'Interactive installation.' }
        ],
        ticketTiers: [
            { id: 'day', name: 'Day Pass', price: '₹600', type: 'individual', requiredFields: [] },
            { id: 'student', name: 'Student Pass', price: '₹300', type: 'individual', description: 'Valid ID required.', requiredFields: [{ id: 'id_no', label: 'Student ID No', type: 'text', required: true, scope: 'attendee' }] }
        ],
        addOns: [
            { id: 'catalog', name: 'Exhibition Catalog', price: '₹1,200', description: 'Hardcover book of 2025 works.', type: 'merch' }
        ]
    },
    {
        id: 'college-fest-1',
        title: 'Mood Indigo 2025',
        date: 'Dec 18 - 21, 2025',
        venue: { name: 'IIT Bombay', city: 'Mumbai' },
        description: 'Asia’s largest college cultural festival. Competitions, concerts, and chaos.',
        imageUrl: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=2070&auto=format&fit=crop',
        price: '₹500',
        category: 'Art',
        subCategory: 'Cultural',
        organizer: { name: "IIT Bombay" },
        ticketTiers: [
            {
                id: 'solo_dance',
                name: 'Solo Dance Competition',
                price: '₹500',
                type: 'individual',
                description: 'Entry fee for solo dance category.',
                requiredFields: [
                    { id: 'college', label: 'College Name', type: 'text', required: true, scope: 'booking' },
                    { id: 'song', label: 'Song Track Link (Drive/Spotify)', type: 'url', required: true, scope: 'booking', placeholder: 'Link to your performance track' },
                    { id: 'style', label: 'Dance Style', type: 'select', options: ['Hip Hop', 'Contemporary', 'Classical', 'Bollywood'], required: true, scope: 'booking' }
                ]
            },
            {
                id: 'botb',
                name: 'Battle of Bands',
                price: '₹1,500',
                type: 'group',
                maxMembers: 6,
                description: 'Team registration for band wars.',
                requiredFields: [
                    { id: 'band_name', label: 'Band Name', type: 'text', required: true, scope: 'booking' },
                    { id: 'genre', label: 'Genre', type: 'text', required: true, scope: 'booking' },
                    { id: 'tech_rider', label: 'Tech Rider Link', type: 'url', required: true, scope: 'booking', placeholder: 'Link to equipment requirements' },
                    { id: 'tshirt', label: 'T-Shirt Size', type: 'select', options: ['S', 'M', 'L', 'XL'], required: true, scope: 'attendee' }
                ]
            }
        ]
    },
    {
        id: 'pune-comedy-1',
        title: 'Zakir Khan: Live in Pune',
        date: 'Sat, Nov 22, 2025, 19:00',
        venue: { name: 'Liberty Square', city: 'Pune' },
        description: 'The Sakht Launda returns with his new special "Mann Pasand".',
        imageUrl: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?q=80&w=2070&auto=format&fit=crop',
        price: '₹999',
        category: 'Art',
        subCategory: 'Comedy',
        organizer: { name: "OML" },
        ticketTiers: [
            { id: 'silver', name: 'Silver', price: '₹999', type: 'individual', description: 'Rear seating.', requiredFields: [] },
            { id: 'gold', name: 'Gold', price: '₹1,999', type: 'individual', description: 'Middle rows.', requiredFields: [] },
            { id: 'platinum', name: 'Platinum', price: '₹2,999', type: 'individual', description: 'Front rows.', requiredFields: [] }
        ]
    },

    // =================================================================
    // PAST / COMPLETED EVENTS (For Results & History)
    // =================================================================
    {
        id: 'past-hack-1',
        title: 'Smart India Hackathon 2024 (Grand Finale)',
        date: 'Aug 20, 2024',
        venue: { name: 'IIT Madras', city: 'Chennai' },
        description: 'National level hackathon for smart innovation.',
        imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop',
        price: 'Closed',
        category: 'Tech',
        subCategory: 'Hackathon',
        organizer: { name: "MoE Innovation Cell" },
        results: [
            { winner: "Team Binary Brains", score: "Winner", details: "Project: AI Crop Disease Detection" },
            { winner: "Team Nexus", score: "Runner Up", details: "Project: Decentralized Voting" }
        ],
        ticketTiers: []
    },
    {
        id: 'past-esports-1',
        title: 'Skyesports Championship 5.0',
        date: 'Jul 15, 2024',
        venue: { name: 'Mumbai', city: 'Mumbai' },
        description: 'CS2 LAN Finals.',
        imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071&auto=format&fit=crop',
        price: 'Closed',
        category: 'Esports',
        subCategory: 'Tournament',
        organizer: { name: "Skyesports" },
        results: [
            { winner: "Team Spirit", score: "3 - 1", details: "Map Score: 13-5, 10-13, 13-9, 13-4" }
        ],
        ticketTiers: []
    }
];

export const POPULAR_CITIES = [
    { city: 'Mumbai', country: 'India', imageUrl: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?q=80&w=200&auto=format&fit=crop' },
    { city: 'Delhi', country: 'India', imageUrl: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=200&auto=format&fit=crop' },
    { city: 'Bengaluru', country: 'India', imageUrl: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?q=80&w=200&auto=format&fit=crop' },
    { city: 'Hyderabad', country: 'India', imageUrl: 'https://images.unsplash.com/photo-1662581699042-70b925b64c64?q=80&w=200&auto=format&fit=crop' },
    { city: 'Chennai', country: 'India', imageUrl: 'https://images.unsplash.com/photo-1621516628285-45d2de85662e?q=80&w=200&auto=format&fit=crop' },
    { city: 'Pune', country: 'India', imageUrl: 'https://images.unsplash.com/photo-1634800345091-6200a74c7280?q=80&w=200&auto=format&fit=crop' },
    { city: 'Kolkata', country: 'India', imageUrl: 'https://images.unsplash.com/photo-1558431382-27e30314225d?q=80&w=200&auto=format&fit=crop' },
    { city: 'Goa', country: 'India', imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=200&auto=format&fit=crop' },
    { city: 'Ahmedabad', country: 'India', imageUrl: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?q=80&w=200&auto=format&fit=crop' },
    { city: 'Jaipur', country: 'India', imageUrl: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=200&auto=format&fit=crop' }
];