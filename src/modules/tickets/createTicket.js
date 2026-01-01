import { prisma } from "../../../config/prisma.js";

export const createTickets = async (req, res) => {
    try {
        const user = req.user;
        const { eventId } = req.params;
        const { tickets } = req.body;

        if(!user){
            return res.status(401).json({message: "USER_NOT_EXISTS"})
        }

        if(!Array.isArray(tickets) || tickets.length === 0 ){
            return res.status(400)/json({
                message: "AT_LEAST_ONE_TICKET_REQUIRED"
            });
        }

        // 3. Find Event
        const event = await prisma.event.findUnique({
            where:{id: eventId}
        });

        if(!event){
            return res.status(404).json({
                message: "EVENT_NOT_EXIST"
            });
        }

        const createdTicket = await prisma.ticket.createMany({
            data: tickets.map(ticket => ({
                eventId,
                name: ticket.name,
                price: ticket.price,
                quantity: ticket.quantity
            })),
        });

        return res.status(201).json({
            message: "TICKET_CREATED",
            count: createdTicket.count
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "TICKET_CREATE_FAILED"
        })
    }
}
