import { prisma } from "../../../config/prisma.js";


export const eventCreate = async (req, res) => {
    const discoverabilityMap = {
        PUBLIC: true,
        PRIVATE: false,
    };


    try {
        const user = req.user;
        console.log("User Data -->", user);

        if (!user) {
            return res.status(401).json({
                message: "USER_NOT_EXIST"
            });
        }

        const {
            title,
            description,
            venue,
            imageUrl, // ✅ Added
            startDate,
            endDate,
            evType,
            price,
            organizerId: bodyOrganizerId,
            shareCode,
            isDiscoverable: clientDiscoverable,
            isSingleTicket,
            allowMultipleBookings,
            approvalStatus,
            approvedBy,
            approvedAt,
            // New Fields
            info,
            announcement,
            isOnline,
            isPrivate,
            isRegistrationOpen,
            totalBooked,
            totalTickets,
            showevent, // ✅ Added
            category,     // ✅ Added
            subCategory   // ✅ Added
        } = req.body;


        // Determine Target Organizer ID
        let targetOrganizerId;

        if (user.platformRole === "ADMIN") {
            if (!bodyOrganizerId) {
                return res.status(400).json({ message: "ORGANIZER_ID_REQUIRED_FOR_ADMIN" });
            }
            targetOrganizerId = bodyOrganizerId;
        } else {
            // If Organizer/User, verify they own the provided organizerId OR default to their primary one
            // Ideally, the frontend sends the organizerId they are acting as.
            if (!bodyOrganizerId) {
                // Determine primary org?
                const primaryOrg = await prisma.userOrganizer.findFirst({
                    where: { userId: user.id }
                });
                if (!primaryOrg) return res.status(403).json({ message: "NO_ORGANIZER_ASSOCIATED" });
                targetOrganizerId = primaryOrg.organizerId;
            } else {
                // Verify association
                const isAssociated = await prisma.userOrganizer.findUnique({
                    where: {
                        userId_organizerId: { userId: user.id, organizerId: bodyOrganizerId }
                    }
                });
                if (!isAssociated) return res.status(403).json({ message: "NOT_AUTHORIZED_FOR_ORGANIZER" });
                targetOrganizerId = bodyOrganizerId;
            }
        }


        const isDiscoverable = evType in discoverabilityMap
            ? discoverabilityMap[evType]
            : Boolean(clientDiscoverable);


        let approveStatus;
        let approveBy;
        let approveAtDate;
        if (user.platformRole === "ADMIN" || user.platformRole === "ORGANIZER") {
            approveStatus = "APPROVED";
            approveBy = user.id;
            approveAtDate = new Date();
        }



        // Generate slug from title and date
        const dateObj = new Date(startDate); // Using startDate for slug generation
        const dateSuffix = !isNaN(dateObj.getTime())
            ? `-${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`
            : '';

        let baseSlug = title.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');

        baseSlug = `${baseSlug}${dateSuffix}`;

        let slug = baseSlug;
        let count = 1;

        // Check for collision
        while (await prisma.event.findUnique({ where: { slug } })) {
            slug = `${baseSlug}-${count}`;
            count++;
        }

        // 1. Create Event
        const event = await prisma.event.create({
            data: {
                title,
                description,
                venue: venue ? {
                  name: venue.name,
          city: venue.city,
          state: venue.state,
          country: venue.country,
          pincode: venue.pincode,
          latitude: venue.latitude ?? null,
          longitude: venue.longitude ?? null
                } : null,
                imageUrl, // ✅ Added
                slug,     // ✅ Added
                startDate,
                endDate,
                evType,
                isDiscoverable,
                isSingleTicket: Boolean(isSingleTicket),
                allowMultipleBookings: allowMultipleBookings !== undefined ? Boolean(allowMultipleBookings) : true,
                hasCustomFields: false, // Default to false, updated when fields are added

                // New Fields
                info,
                announcement,
                isOnline: Boolean(isOnline),
                isPrivate: Boolean(isPrivate),
                isRegistrationOpen: isRegistrationOpen !== undefined ? Boolean(isRegistrationOpen) : true,
                totalBooked: totalBooked ? parseInt(totalBooked) : 0,
                totalTickets: totalTickets ? parseInt(totalTickets) : 0,

                price,
                shareCode,
                organizerId: targetOrganizerId,
                approvalStatus: approveStatus,
                approvedBy: approveBy,
                approvedAt: approveAtDate,
                createdBy: user.id,
                category: category || "OTHERS", // Default if missing
                subCategory: subCategory || null,

                coupons: req.body.coupons || [], // ✅ Added

                showevent: showevent !== undefined ? Boolean(showevent) : true, // ✅ Added
            },
        });

        return res.status(201).json({
            message: "EVENT_CREATED",
            event,
        });


    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "EVENT_CREATE_FAILED",
            error: error.message
        });
    }
}
