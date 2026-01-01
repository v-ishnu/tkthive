import  { prisma } from "../../../config/prisma.js";

export async function loadEventContext(req, res, next){

    const eventId = req.params.eventId || req.body.eventId;

    if(!eventId) return next();

    const staff = await prisma.eventStaff.findFirst({
        where: {
            userId: req.user.id,
            eventId
        },
    });

    req.eventRole = staff.role;
    next();
}
