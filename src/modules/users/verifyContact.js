import {prisma} from "../../../config/prisma.js";

export const verifyPhone = async (req, res) => {
    try {
        const user = req.user;

        const existingUser = await prisma.user.findUnique({
            where: { id: user.id }
        });

    } catch (error) {

    }
}


export const verifyEmail = async (req, res) => {
    try {
        const user = req.user;

        const existingUser = await prisma.user.findUnique({
            where: { id: user.id }
        });

    } catch (error) {

    }
}
