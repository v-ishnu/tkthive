import { prisma } from "../../../../config/prisma.js";
import ExcelJS from 'exceljs';

export const exportEventBookings = async (req, res) => {
    try {
        const { id: eventId } = req.params;
        const { status } = req.query; // Optional filter

        // 1. Verify Event (Basic check, middleware handles auth)
        const event = await prisma.event.findUnique({
            where: { id: eventId },
            select: { id: true, title: true }
        });

        if (!event) return res.status(404).json({ message: "EVENT_NOT_FOUND" });

        // 2. Fetch Bookings
        const whereClause = {
            items: {
                some: { ticket: { eventId: eventId } }
            },
            ...(status && status !== "ALL" ? { paymentStatus: status } : {})
        };

        const bookings = await prisma.booking.findMany({
            where: whereClause,
            include: {
                user: {
                    select: { name: true, email: true, phoneNumber: true }
                },
                items: {
                    include: {
                        ticket: { select: { name: true, type: true } }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        // 3. Setup Workbook
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Transactions');

        worksheet.columns = [
            { header: 'S.No', key: 'sNo', width: 8 },
            { header: 'Order ID', key: 'orderId', width: 25 },
            { header: 'Status', key: 'status', width: 15 },
            { header: 'Date', key: 'date', width: 20 },
            { header: 'User Name', key: 'userName', width: 20 },
            { header: 'User Email', key: 'userEmail', width: 30 },
            { header: 'User Phone', key: 'userPhone', width: 15 },
            { header: 'Amount', key: 'amount', width: 10 },
            { header: 'Currency', key: 'currency', width: 10 },
            { header: 'Ticket', key: 'ticket', width: 20 },
            { header: 'Qty', key: 'qty', width: 5 },
            { header: 'Addons', key: 'addons', width: 30 },
            { header: 'Attendee Data', key: 'attendeeData', width: 50 },
        ];

        // 4. Transform Data
        let serialNo = 1;
        bookings.forEach(booking => {
            booking.items.forEach(item => {
                const attendees = item.attendeeData || [];
                // Format attendee data specifically
                const attendeeStr = Array.isArray(attendees)
                    ? attendees.map(a => `${a.name || 'N/A'} (${a.email || 'N/A'})`).join('; ')
                    : (attendees.name ? `${attendees.name} (${attendees.email})` : JSON.stringify(attendees));

                const addonsStr = (item.addons || []).map(a => `${a.name} x${a.quantity}`).join(', ');

                worksheet.addRow({
                    sNo: serialNo++,
                    orderId: booking.orderId,
                    status: booking.paymentStatus,
                    date: new Date(booking.createdAt).toLocaleString(),
                    userName: booking.user?.name || "N/A",
                    userEmail: booking.user?.email || "N/A",
                    userPhone: booking.user?.phoneNumber || "N/A",
                    amount: booking.payment,
                    currency: booking.currency,
                    ticket: item.ticket?.name || "Unknown",
                    qty: item.quantity,
                    addons: addonsStr,
                    attendeeData: attendeeStr
                });
            });
        });

        // 5. Send Response
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=transactions-${eventId}.xlsx`);

        await workbook.xlsx.write(res);
        res.end();

    } catch (error) {
        console.error("Export Bookings Error:", error);
        return res.status(500).json({ message: "EXPORT_FAILED" });
    }
};
