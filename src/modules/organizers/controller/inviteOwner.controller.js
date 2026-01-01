import { isOrganizerOwner } from "../organizer.policy.js";
import { inviteOwner } from "../service/inviteOwner.js";

export const inviteStaffController = async (req, res) => {
    const {organizerId} = req.params;
    const { userId, role } = req.body;

    const isOwner = await isOrganizerOwner(
        req.user.id,
        organizerId
    );

    if(!isOwner){
        return res.status(403).json({
            message: "Only organizer owner can invite staff",
          });
    }

    await inviteOwner({organizerId, userId, role});

    return res.status(201).json({
        message: "Staff add successfully"
    })
}
