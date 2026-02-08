

import { prisma } from "../../../config/prisma.js";
import { getPaymentProvider } from "../payment/factory/paymentProviderFactory.js";
import crypto from "crypto";
import sendRegistrationSuccessEmail from "../../utils/mail/registrationSuccess.mail.js";
import { createNotification } from "../notifications/notification.service.js";

/* 
  1. initiateBooking()
  → Validate stock, custom fields
  → Create Booking + Items (PENDING)
  → Does NOT return payment session anymore
*/
export const initiateBooking = async (req, res) => {
    const { eventId } = req.params;
    const userId = req.user.id;
    const { tickets, couponCode, referralCode } = req.body;

    if (!tickets || !Array.isArray(tickets)) {
        return res.status(400).json({ message: "INVALID_TICKETS_DATA" });
    }

    const event = await prisma.event.findUnique({
        where: { id: eventId },
        include: { tickets: true, addons: true, customFields: true }
    });

    if (!event) return res.status(404).json({ message: "EVENT_NOT_FOUND" });

    // Validate Referral Code if provided
    if (referralCode) {
        if (!event.referralCodes || !event.referralCodes.includes(referralCode)) {
            return res.status(400).json({ message: "INVALID_REFERRAL_CODE" });
        }
    }

    // Check for Duplicate Registration

    const existingBooking = await prisma.booking.findFirst({
        where: {
            userId: userId,
            items: {
                some: {
                    ticket: {
                        eventId: eventId
                    }
                }
            },
            bookingStatus: { in: ["CONFIRMED"] }
        }
    });

    if (existingBooking) {
        return res.status(400).json({ message: "YOU HAVE ALREADY REGISTERED FOR THIS EVENT" });
    }


    let totalAmount = 0;
    const bookingItems = [];

    for (const item of tickets) {
        const ticket = event.tickets.find(t => t.id === item.ticketId);
        if (!ticket || !ticket.isActive) return res.status(400).json({ message: "INVALID_TICKET", details: item.ticketId });

        if (ticket.sold + item.quantity > ticket.quantity) {
            return res.status(400).json({ message: "TICKET_SOLD_OUT", details: ticket.name });
        }

        if (ticket.type !== "GROUP" && item.attendees && item.attendees.length !== item.quantity) {
            return res.status(400).json({ message: "ATTENDEE_COUNT_MISMATCH", details: ticket.name });
        }

        if (ticket.type === "GROUP" && ticket.minMembers && item.attendees.length < ticket.minMembers) {
            return res.status(400).json({ message: "MINIMUM_MEMBERS_REQUIRED", details: `${ticket.name} requires at least ${ticket.minMembers} members.` });
        }

        const ticketTotal = ticket.price * item.quantity;
        let addonTotal = 0;
        const selectedAddons = [];

        if (item.addons?.length) {
            for (const ad of item.addons) {
                const addon = event.addons.find(a => a.id === ad.addonId);
                if (!addon || !addon.isActive) continue;
                addonTotal += addon.price * ad.quantity;
                selectedAddons.push({
                    addonId: addon.id,
                    name: addon.name,
                    price: addon.price,
                    quantity: ad.quantity,
                    image: addon.image
                });
            }
        }

        totalAmount += ticketTotal + addonTotal;

        // Helper to map field IDs to Labels
        const fieldMap = (event.customFields || []).reduce((acc, field) => {
            acc[field.id] = field.label;
            return acc;
        }, {});

        const processedAttendees = (item.attendees || []).map(att => {
            const flatResponses = {};
            if (att.responses && Array.isArray(att.responses)) {
                att.responses.forEach(r => {
                    const label = fieldMap[r.fieldId] || r.fieldId; // Fallback to ID if label not found
                    flatResponses[label] = r.value;
                });
            }
            // Return flat structure
            return {
                name: att.name,
                email: att.email,
                phone: att.phone,
                ...flatResponses // Spread custom fields: { "Team Name": "X", "WhatsApp": "Y" }
            };
        });

        bookingItems.push({
            ticketId: ticket.id,
            ticketName: ticket.name,
            unitPrice: ticket.price,
            quantity: item.quantity,
            totalPrice: ticketTotal + addonTotal,
            addons: selectedAddons,
            attendeeData: processedAttendees // Save FLATTENED data
        });
    }

    // Coupon Logic
    let discount = 0;
    let appliedCoupon = null;

    if (couponCode && event.coupons && Array.isArray(event.coupons)) {
        const coupon = event.coupons.find(c => c.code === couponCode);
        if (coupon) {
            // Check limit if applicable
            if (coupon.limit && coupon.used >= coupon.limit) {
                return res.status(400).json({ message: "COUPON_LIMIT_REACHED" });
            }

            discount = (totalAmount * coupon.discountPercentage) / 100;
            totalAmount = Math.max(0, totalAmount - discount); // Prevent negative
            appliedCoupon = couponCode;
        } else {
            return res.status(400).json({ message: "INVALID_COUPON" });
        }
    }

    const orderId = `ORD_${Date.now()}_${crypto.randomUUID()}`;

    await prisma.booking.create({
        data: {
            userId,
            orderId,
            payment: totalAmount,
            discount: discount > 0 ? discount : undefined,
            appliedCoupon: appliedCoupon,
            bookingStatus: "PENDING",
            paymentStatus: "PENDING",
            expiresAt: new Date(Date.now() + 15 * 60 * 1000),
            items: { create: bookingItems },
            referralCode: referralCode || null, // ✅ Added

        }
    });

    // Just return Order ID. Frontend will then call /create-payment-session if needed.
    return res.status(201).json({
        message: "BOOKING_INITIATED",
        orderId,
        amount: totalAmount
    });
};

/* 
  2. createPaymentSession()
  → Create PaymentIntent (Cashfree/Razorpay/etc)
*/
export const createPaymentSession = async (req, res) => {
    const { orderId, provider = "CASHFREE", returnUrl, customerDetails } = req.body;
    let user = req.user;

    // Use provided customerDetails to override/augment user info (e.g. phone entered in form)
    if (customerDetails) {
        user = { ...user, ...customerDetails };
    }

    try {
        const booking = await prisma.booking.findUnique({ where: { orderId } });
        if (!booking) return res.status(404).json({ message: "BOOKING_NOT_FOUND" });

        if (booking.paymentStatus === "PAID") return res.status(400).json({ message: "ALREADY_PAID" });

        const providerService = getPaymentProvider(provider);

        // session might be a string (Cashfree sessionId) or object depending on provider
        const amount = Number(parseFloat(booking.payment).toFixed(2));

        const session = await providerService.initiate({
            orderId,
            amount,
            user,
            returnUrl
        });

        return res.json({
            orderId,
            provider,
            session
        });
    } catch (error) {
        console.error("Create Payment Session Error:", error);
        return res.status(500).json({ message: "PAYMENT_SESSION_FAILED", error: error.message });
    }
};

/* 
  3. confirmPaymentWebhook()
  → Verify payment status
  → Mark Booking PAID
  → Create Registrations + QR
  → Update Stock
*/
export const cashfreeWebhook = async (req, res) => {
    try {
        const signature = req.headers["x-webhook-signature"];
        const rawBody = req.rawBody; // REQUIRED

        if (!signature) {
            return res.status(400).json({ message: "SIGNATURE_MISSING" });
        }

        // 1️⃣ Verify Signature
        const expectedSignature = crypto
            .createHmac("sha256", process.env.CASHFREE_WEBHOOK_SECRET)
            .update(rawBody)
            .digest("base64");

        if (signature !== expectedSignature) {
            return res.status(401).json({ message: "INVALID_SIGNATURE" });
        }

        const payload = JSON.parse(rawBody.toString());

        // 2️⃣ Only care about successful payments
        if (payload.type !== "PAYMENT_SUCCESS_WEBHOOK") {
            return res.status(200).json({ message: "IGNORED_EVENT" });
        }

        const orderId = payload.data?.order?.order_id;
        const orderStatus = payload.data?.order?.order_status;

        if (!orderId) {
            return res.status(400).json({ message: "ORDER_ID_MISSING" });
        }

        if (orderStatus !== "PAID") {
            return res.status(200).json({ message: "PAYMENT_NOT_PAID" });
        }

        // 3️⃣ Finalize booking (idempotent)
        const result = await finalizeBooking(orderId);

        return res.status(200).json({
            message: "WEBHOOK_PROCESSED",
            result
        });

    } catch (error) {
        console.error("CASHFREE WEBHOOK ERROR:", error);
        return res.status(500).json({ message: "WEBHOOK_FAILED" });
    }
};

/*
  4. verifyBooking (Synchronous)
  → Frontend calls this after payment flow
  → Checks status with Provider
  → If PAID, finalize booking immediately
*/
export const verifyBooking = async (req, res) => {
    const { orderId } = req.params;

    if (!orderId) return res.status(400).json({ message: "ORDER_ID_REQUIRED" });

    try {
        // 1. Check Provider Status
        const providerService = getPaymentProvider("CASHFREE");
        const providerData = await providerService.verify({ orderId });

        if (providerData.order_status !== "PAID") {
            return res.status(200).json({
                status: providerData.order_status,
                message: "PAYMENT_NOT_PAID",
                bookingStatus: "PENDING"
            });
        }

        // 2. Finalize Booking (Idempotent)
        const result = await finalizeBooking(orderId);

        return res.status(200).json({
            status: "PAID",
            message: result.message,
            bookingStatus: result.bookingStatus || "CONFIRMED"
        });

    } catch (error) {
        console.error("Verify Booking Error:", error);
        return res.status(500).json({ message: "VERIFICATION_FAILED" });
    }
};

// --- Helper: Finalize Booking ---
// Handles DB updates, Stock, Registration creation.
// Idempotent: Checks if already PAID.
async function finalizeBooking(orderId) {
    const booking = await prisma.booking.findUnique({
        where: { orderId },
        include: { items: { include: { ticket: { include: { event: true } } } } }
    });

    if (!booking) return { success: false, message: "BOOKING_NOT_FOUND" };
    if (booking.paymentStatus === "PAID") return { success: true, message: "ALREADY_PROCESSED", bookingStatus: booking.bookingStatus };

    // Transaction
    await prisma.$transaction(async tx => {
        // 1. Update Booking
        await tx.booking.update({
            where: { orderId },
            data: { paymentStatus: "PAID", bookingStatus: "CONFIRMED" }
        });

        // 2. Process Items
        const organizerUpdates = {}; // Map: organizerId -> { revenue, tickets }

        for (const item of booking.items) {
            // Update Stock
            await tx.ticket.update({
                where: { id: item.ticketId },
                data: { sold: { increment: item.quantity } }
            });

            // Calculate Item Revenue (Ticket + Addons)
            const itemTicketRevenue = item.unitPrice * item.quantity;
            let itemAddonRevenue = 0;
            if (item.addons && Array.isArray(item.addons)) {
                itemAddonRevenue = item.addons.reduce((sum, addon) => sum + (addon.price * addon.quantity), 0);
            }
            const totalItemRevenue = itemTicketRevenue + itemAddonRevenue;

            // Increment Organizer Revenue and Tickets Sold (Accumulate)
            if (item.ticket.event && item.ticket.event.organizerId) {
                const orgId = item.ticket.event.organizerId;
                if (!organizerUpdates[orgId]) {
                    organizerUpdates[orgId] = { revenue: 0, tickets: 0 };
                }
                organizerUpdates[orgId].revenue += totalItemRevenue;
                organizerUpdates[orgId].tickets += item.quantity;
            }

            // 2. Create Registrations from BookingItem Data
            const attendees = item.attendeeData || [];

            for (let i = 0; i < item.quantity; i++) {
                const attendee = attendees[i] || {};

                // Determine data to store: For Group tickets (Qty=1, Multiple Attendees), store ALL.
                // For Individual (Qty=N, Attendees=N), store specific one.
                const isGroupTicket = item.ticket.type === 'GROUP' || item.ticket.type === 'group';
                const dataToStore = isGroupTicket ? attendees : attendee;

                await tx.eventRegistration.create({
                    data: {
                        eventId: item.ticket.eventId,
                        userId: booking.userId,
                        bookingId: booking.id,
                        ticketId: item.ticketId,
                        orderId: booking.orderId,
                        unitPrice: item.unitPrice,
                        qrCode: `QR_${Date.now()}_${crypto.randomUUID()}`,
                        status: "CONFIRMED",
                        addons: item.addons,
                        registrationData: dataToStore // Store Array for Group, Object for Individual
                    }
                });
            }
        }

        // 3. Update Organizer Stats
        for (const [orgId, stats] of Object.entries(organizerUpdates)) {
            await tx.organizer.update({
                where: { id: orgId },
                data: {
                    totalRevenue: { increment: stats.revenue },
                    totalTicketsSold: { increment: stats.tickets }
                }
            });
        }
    });

    // Send Email Async
    (async () => {
        try {
            const user = await prisma.user.findUnique({ where: { id: booking.userId } });
            if (!user) return;

            // Fetch Event Title (assuming simple ticket structure where all items belong to same event or we just take first)
            // Ideally booking.items[0].ticket.event.title if we included it, but we only included ticket.
            // Let's refetch minimal event info or rely on what we have.
            const firstTicket = await prisma.ticket.findUnique({
                where: { id: booking.items[0].ticketId },
                include: {
                    event: {
                        select: {
                            title: true,
                            communityLink: true,
                            communityMessage: true,
                            organizer: {
                                select: { contactEmail: true }
                            }
                        }
                    }
                }
            });

            const totalTickets = booking.items.reduce((acc, item) => acc + item.quantity, 0);

            const ticketDetails = booking.items.map(item => ({
                name: item.ticketName || item.ticket?.name || "Ticket",
                quantity: item.quantity,
                price: item.unitPrice,
                addons: item.addons || [],
                attendees: item.attendeeData || []
            }));

            await sendRegistrationSuccessEmail({
                email: user.email,
                orderId: booking.orderId,
                amount: booking.payment,
                ticketCount: totalTickets,
                eventTitle: firstTicket?.event?.title || "Event",
                actionUrl: `${process.env.FRONTEND_URL || "https://tkthive.com"}/mytickets`,
                communityLink: firstTicket?.event?.communityLink,
                communityMessage: firstTicket?.event?.communityMessage,
                organizerEmail: firstTicket?.event?.organizer?.contactEmail,
                ticketDetails,
                userDetails: {
                    name: user.name,
                    email: user.email
                }
            });
        } catch (err) {
            console.error("Email Sending Failed in Finalize:", err);
        }

        // Create Notification
        try {
            await createNotification({
                userId: booking.userId,
                title: "Payment Successful!",
                message: `Your payment for ${booking.items.length} ticket(s) was successful.`,
                type: "ticket",
                actionUrl: "/mytickets",
                data: { orderId: booking.orderId, amount: booking.payment }
            });
        } catch (err) {
            console.error("Notification Error in Finalize:", err);
        }

    })();

    return { success: true, message: "BOOKING_FINALIZED", bookingStatus: "CONFIRMED" };
}


export const registerFreeEvent = async (req, res) => {
    const { eventId } = req.params;
    const { tickets, referralCode } = req.body;
    const userId = req.user.id;
    const userEmail = req.user.email; // Capture for email

    // Logic from previous step... adapted for consistency
    const inputTickets = tickets || [];

    if (inputTickets.length === 0) return res.status(400).json({ message: "NO_TICKETS" });

    // ... (Free event logic remains largely same: validate -> transaction create booking/regs -> update stock)
    // Re-implementing correctly for this file
    try {
        const event = await prisma.event.findUnique({
            where: { id: eventId },
            include: {
                tickets: true,
                customFields: true,
                organizer: {
                    select: { contactEmail: true }
                }
            }
        });
        if (!event) return res.status(404).json({ message: "EVENT_NOT_FOUND" });

        // Validate Referral Code if provided
        if (referralCode) {
            if (!event.referralCodes || !event.referralCodes.includes(referralCode)) {
                return res.status(400).json({ message: "INVALID_REFERRAL_CODE" });
            }
        }

        // Check for Duplicate Registration
        if (!event.allowMultipleBookings) {
            const existingBooking = await prisma.booking.findFirst({
                where: {
                    userId: userId,
                    items: {
                        some: {
                            ticket: {
                                eventId: eventId
                            }
                        }
                    },
                    bookingStatus: { in: ["CONFIRMED", "PENDING"] }
                }
            });

            if (existingBooking) {
                return res.status(400).json({ message: "ALREADY_REGISTERED" });
            }
        }

        const bookingItemsToCreate = [];
        const registrationsToCreate = [];
        const orderId = `FREE_${Date.now()}_${crypto.randomUUID()}`;
        let totalCount = 0;

        // Map Helper
        const fieldMap = (event.customFields || []).reduce((acc, field) => {
            acc[field.id] = field.label;
            return acc;
        }, {});

        for (const item of inputTickets) {
            const ticket = event.tickets.find(t => t.id === item.ticketId);
            if (!ticket || ticket.price > 0) return res.status(400).json({ message: "INVALID_FREE_TICKET" });
            if (ticket.sold + item.quantity > ticket.quantity) return res.status(400).json({ message: "SOLD_OUT" });

            const rawAttendees = item.attendees || [];

            // Flatten Data
            const processedAttendees = rawAttendees.map(att => {
                const flatResponses = {};
                if (att.responses && Array.isArray(att.responses)) {
                    att.responses.forEach(r => {
                        const label = fieldMap[r.fieldId] || r.fieldId;
                        flatResponses[label] = r.value;
                    });
                }
                return {
                    name: att.name,
                    email: att.email,
                    phone: att.phone,
                    ...flatResponses
                };
            });

            totalCount += item.quantity;
            bookingItemsToCreate.push({
                ticketId: ticket.id,
                ticketName: ticket.name,
                unitPrice: 0,
                quantity: item.quantity,
                totalPrice: 0,
                addons: [],
                attendeeData: processedAttendees // Store flattened data
            });

            for (let i = 0; i < item.quantity; i++) {
                registrationsToCreate.push({
                    ticketId: ticket.id,
                    attendee: processedAttendees[i] || {}
                });
            }
        }

        await prisma.$transaction(async tx => {
            const booking = await tx.booking.create({
                data: {
                    userId,
                    orderId,
                    payment: 0,
                    bookingStatus: "CONFIRMED",
                    paymentStatus: "PAID",
                    expiresAt: new Date(),
                    items: { create: bookingItemsToCreate },
                    referralCode: referralCode || null, // ✅ Added
                }
            });

            for (const reg of registrationsToCreate) {
                const attendee = reg.attendee; // This is single attendee from loop

                // Retrieve ticket to check type
                // We know ticketId from reg.ticketId. We need the full ticket object or type.
                // We have 'event.tickets' available in this scope.
                const ticket = event.tickets.find(t => t.id === reg.ticketId);
                const isGroupTicket = ticket && (ticket.type === 'GROUP' || ticket.type === 'group');

                // If Group, we need the FULL list of processed attendees for this ticket item.
                // We can find the original item from inputTickets or bookingItemsToCreate?
                // Actually 'attendeeData' in bookingItemsToCreate stores the full list.
                // Let's find the matching booking item.
                const bookingItem = bookingItemsToCreate.find(bi => bi.ticketId === reg.ticketId);
                const fullAttendees = bookingItem ? bookingItem.attendeeData : [attendee];

                const dataToStore = isGroupTicket ? fullAttendees : attendee;

                await tx.eventRegistration.create({
                    data: {
                        eventId,
                        userId,
                        bookingId: booking.id,
                        ticketId: reg.ticketId,
                        orderId: booking.orderId,
                        unitPrice: 0,
                        qrCode: crypto.randomUUID(),
                        status: "CONFIRMED",
                        addons: [],
                        registrationData: dataToStore
                    }
                });
            }

            for (const item of inputTickets) {
                await tx.ticket.update({
                    where: { id: item.ticketId },
                    data: { sold: { increment: item.quantity } }
                });
            }

            // Increment Organizer Tickets Sold (Free Event - Revenue is 0)
            if (event.organizerId) {
                await tx.organizer.update({
                    where: { id: event.organizerId },
                    data: {
                        totalTicketsSold: { increment: totalCount }
                    }
                });
            }
        });

        // Prepare Ticket Details
        const ticketDetails = inputTickets.map((item, index) => {
            // We need to retrieve the full attendee data that was processed earlier (flattened).
            // However, inputTickets has raw data. We created 'bookingItemsToCreate'.
            // Let's use 'bookingItemsToCreate' which has the 'attendeeData' populated.
            // But we need to match it. 'bookingItemsToCreate' is in same order as 'inputTickets' loop?
            // Yes, we pushed to it in the loop.
            const matchingBookingItem = bookingItemsToCreate[index];

            return {
                name: matchingBookingItem.ticketName,
                quantity: matchingBookingItem.quantity,
                price: 0,
                addons: matchingBookingItem.addons || [],
                attendees: matchingBookingItem.attendeeData || []
            };
        });

        // Send Email Async
        sendRegistrationSuccessEmail({
            email: userEmail,
            orderId,
            amount: 0,
            ticketCount: totalCount,
            eventTitle: event.title,
            actionUrl: `${process.env.FRONTEND_URL || "https://tkthive.com"}/mytickets`,
            communityLink: event.communityLink,
            communityMessage: event.communityMessage,
            organizerEmail: event.organizer?.contactEmail,
            ticketDetails,
            userDetails: {
                name: req.user.name || "User",
                email: req.user.email
            }
        }).catch(err => console.error("Email API Error:", err));

        // Create Notification
        createNotification({
            userId,
            title: "Registration Confirmed!",
            message: `You have successfully registered for ${event.title}.`,
            type: "ticket",
            actionUrl: "/mytickets",
            data: { orderId, amount: 0 }
        }).catch(err => console.error("Notification Error:", err));

        return res.json({ message: "FREE_REGISTRATION_SUCCESS", orderId });
    } catch (e) {
        console.error(e);
        return res.status(500).send("ERROR");
    }
};

export const getBooking = async (req, res) => {
    const { orderId } = req.params;
    const booking = await prisma.booking.findUnique({
        where: { orderId },
        include: { items: true }
    });
    if (!booking) return res.status(404).json({ message: "NOT_FOUND" });
    res.json(booking);
};

export const confirmBooking = async (req, res) => {
    const { orderId } = req.params;
    try {
        const result = await finalizeBooking(orderId);
        if (!result.success) {
            return res.status(400).json({ message: result.message });
        }
        return res.status(200).json(result);
    } catch (error) {
        console.error("Manual Confirm Error:", error);
        return res.status(500).json({ message: "CONFIRMATION_FAILED" });
    }
};

export const validateCoupon = async (req, res) => {
    try {
        const { eventId } = req.params;
        const { couponCode } = req.body;

        if (!couponCode) {
            return res.status(400).json({ message: "COUPON_CODE_REQUIRED" });
        }

        const event = await prisma.event.findUnique({
            where: { id: eventId },
        });

        if (!event) {
            return res.status(404).json({ message: "EVENT_NOT_FOUND" });
        }

        if (!event.coupons || !Array.isArray(event.coupons)) {
            return res.status(400).json({ message: "INVALID_COUPON" });
        }

        const coupon = event.coupons.find(c => c.code === couponCode);

        if (!coupon) {
            return res.status(400).json({ message: "INVALID_COUPON" });
        }

        if (coupon.limit && coupon.used >= coupon.limit) {
            return res.status(400).json({ message: "COUPON_LIMIT_REACHED" });
        }

        return res.status(200).json({
            message: "COUPON_VALID",
            discountPercentage: coupon.discountPercentage,
            code: coupon.code
        });

    } catch (error) {
        console.error("Validate Coupon Error:", error);
        return res.status(500).json({ message: "VALIDATION_FAILED" });
    }
};
