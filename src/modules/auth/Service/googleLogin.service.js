import { prisma } from '../../../../config/prisma.js';

export const googleLoginService = async (data) => {
    const { googleId, email, name, picture } = data;

    // 1. Check if user exists with this googleId
    let user = await prisma.user.findFirst({
        where: { googleId }
    });

    if (user) {
        return user;
    }

    // 2. Check if user exists with this email (link account)
    user = await prisma.user.findUnique({
        where: { email }
    });

    if (user) {
        // Link existing user to Google
        user = await prisma.user.update({
            where: { id: user.id },
            data: {
                googleId,
                isEmailVerified: true
            }
        });
        return user;
    }

    // 3. Create new user
    user = await prisma.user.create({
        data: {
            name,
            email,
            googleId,
            isEmailVerified: true,
            // password can be null as per schema
            // phoneNumber is optional
        }
    });

    return user;
};
