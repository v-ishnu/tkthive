
import { prisma } from "../../../config/prisma.js";

export const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                phoneNumber: true,
                createdAt: true,
                platformRole: true,
                registrations: {
                    include: {
                        event: true,
                        ticket: true
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                }
            }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Map registrations to frontend Ticket type
        const tickets = user.registrations.map(reg => {
            const eventDate = new Date(reg.event.startDate);
            const now = new Date();
            let status = 'upcoming';
            if (eventDate < now) status = 'completed';

            return {
                id: reg.id,
                eventId: reg.event.id,
                eventTitle: reg.event.title,
                eventDate: reg.event.startDate.toISOString(), // Frontend expects string
                eventVenue: reg.event.venue?.name ? `${reg.event.venue.name}, ${reg.event.venue.city || ''}` : "TBA",
                eventImage: `https://picsum.photos/seed/${reg.event.id}/400/300`, // Placeholder as Event has no image
                ticketType: reg.ticket.name,
                price: reg.unitPrice?.toString() || "0",
                bookingDate: reg.createdAt.toISOString(),
                attendees: 1, // Registration is usually 1 person
                status: status
            };
        });

        const userProfile = {
            name: user.name,
            email: user.email,
            phone: user.phoneNumber,
            role: user.platformRole,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`, // Generate avatar based on name
            coverImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop", // Default cover
            location: "Mumbai, India", // Default or fetch if available
            stats: {
                events: tickets.length,
                followers: 0,
                following: 0
            },
            tickets: tickets
        };

        return res.status(200).json({
            message: "Profile fetched successfully",
            user: userProfile
        });

    } catch (error) {
        console.error("getProfile error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
