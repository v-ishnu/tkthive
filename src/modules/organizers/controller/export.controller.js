import { prisma } from "../../../../config/prisma.js";
import ExcelJS from 'exceljs';

export const exportRegistrations = async (req, res) => {
    try {
        const { eventId } = req.params;
        const userId = req.user.id;

        // 1. Verify Event and Access
        const event = await prisma.event.findUnique({
            where: { id: eventId },
            include: { organizer: true }
        });

        if (!event) return res.status(404).json({ message: "EVENT_NOT_FOUND" });

        // Check if user is organizer staff or admin
        const userOrg = await prisma.userOrganizer.findFirst({
            where: {
                userId: userId,
                organizerId: event.organizerId
            }
        });

        if (!userOrg && req.user.platformRole !== "ADMIN") {
            return res.status(403).json({ message: "ACCESS_DENIED" });
        }

        // 2. Fetch Registrations with related data
        const registrations = await prisma.eventRegistration.findMany({
            where: { eventId },
            include: {
                ticket: {
                    select: { name: true, type: true }
                },
                booking: {
                    select: {
                        paymentStatus: true,
                        payment: true,
                        currency: true,
                        discount: true,
                        appliedCoupon: true,
                        referralCode: true // ✅ Added
                    }
                },
                user: {
                    select: { name: true, email: true, phoneNumber: true } // Fallback
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        // 3. Setup Workbook
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Registrations');

        worksheet.columns = [
            { header: 'S.No', key: 'sNo', width: 8 },
            { header: 'Registration ID', key: 'regId', width: 25 },
            { header: 'Order ID', key: 'orderId', width: 25 },
            { header: 'Name', key: 'name', width: 20 },
            { header: 'Email', key: 'email', width: 30 },
            { header: 'Phone', key: 'phone', width: 15 },
            { header: 'Ticket Name', key: 'ticketName', width: 20 },
            { header: 'Ticket Type', key: 'ticketType', width: 15 },
            { header: 'Status', key: 'status', width: 15 },
            { header: 'Scanned', key: 'scanned', width: 10 },
            { header: 'Reg Date', key: 'createdAt', width: 20 },
            { header: 'Payment Status', key: 'paymentStatus', width: 15 },
            { header: 'Amount', key: 'amount', width: 10 },
            { header: 'Discount', key: 'discount', width: 10 },
            { header: 'Coupon', key: 'coupon', width: 15 },
            { header: 'Referral', key: 'referral', width: 15 },
            { header: 'Add-ons', key: 'addons', width: 30 },
            { header: 'Custom Fields', key: 'customFields', width: 40 },
        ];

        // 4. Transform and Add Data
        let serialNo = 1;
        registrations.forEach(reg => {
            const rawData = reg.registrationData || {};
            // Normalize to Array (Group = Array of Objs, Individual = Single Obj)
            const attendeeList = Array.isArray(rawData) ? rawData : [rawData];

            attendeeList.forEach(attendee => {
                // Extract custom fields (everything except standard profile fields)
                const { name, email, phone, ...others } = attendee;

                // Format custom fields as key:value string
                const customFieldStr = Object.entries(others).map(([k, v]) => `${k}: ${v}`).join('; ');

                worksheet.addRow({
                    sNo: serialNo++,
                    regId: reg.id,
                    orderId: reg.orderId,
                    name: attendee.name || reg.user.name,
                    email: attendee.email || reg.user.email,
                    phone: attendee.phone || reg.user.phone || reg.user.phoneNumber || "N/A",
                    ticketName: reg.ticket.name,
                    ticketType: reg.ticket.type,
                    status: reg.status,
                    scanned: reg.scanned ? "Yes" : "No",
                    createdAt: new Date(reg.createdAt).toLocaleString(),
                    paymentStatus: reg.booking?.paymentStatus || "N/A",
                    amount: reg.booking?.payment || 0,
                    discount: reg.booking?.discount || 0,
                    coupon: reg.booking?.appliedCoupon || "",
                    referral: reg.booking?.referralCode || "",
                    addons: (reg.addons || []).map(a => `${a.name} (x${a.quantity})`).join(', '),
                    customFields: customFieldStr
                });
            });
        });

        // 5. Send Response
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=registrations-${eventId}.xlsx`);

        await workbook.xlsx.write(res);
        res.end();

    } catch (error) {
        console.error("Export Error:", error);
        return res.status(500).json({ message: "EXPORT_FAILED" });
    }
};
