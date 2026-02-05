import { prisma } from "../../../../config/prisma.js";
import crypto from "crypto";

export const inviteStaff = async (req, res) => {
    const inviter = req.user;
    const { email, role, eventId } = req.body;

    try {
        const findUser = await prisma.user.findUnique({
            where: {
                email
            }
        });

        if (!findUser) {
            return res.status(401).json({
                message: "USER_NOT_EXIST"
            });
        }

        const eventStaff = await prisma.eventStaff.findFirst({
            where: {
                userId: findUser.id,
                eventId: eventId
            }
        });

        if (eventStaff) {
            return res.status(400).json({
                message: "USER_ALREADY_STAFF"
            });
        }

        // TODO: Create invitation logic here
        // const invitation = await prisma.eventStaffInvitation.create({...})

        return res.status(200).json({
            message: "User is eligible for invitation"
        });

    } catch (error) {
        console.error("Error in inviteStaff:", error);
        return res.status(500).json({
            message: "INTERNAL_SERVER_ERROR"
        });
    }
}
