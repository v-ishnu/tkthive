import { prisma } from "../../../config/prisma.js";

export async function resolveEventRole(req, res, next) {
    const eventId = req.params.eventId;
    if(!eventId) return next();

    const staff = await prisma.eventStaff.findFirst({
        where:{
            eventId,
            userId: req.user.id
        },
    });
    req.eventRole = staff?.role ?? null;
    next();
}
