import { prisma } from "../../../../config/prisma.js";
import crypto from "crypto";

export const inviteStaff = async (req, res) => {
    const inviter = req.user;
    const {email, role, eventId} = req.body;

    try {
        const findUser = await prisma.user.findUnique({
            where: {
                email
            }
        });

        if(!findUser){
            return res.status(401).json({
                message: "USER_NOT_EXIST"
            });
        }

        const eventStaff =
    } catch (error) {

    }
}
