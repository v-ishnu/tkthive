import { prisma } from "../../../config/prisma.js";

// https://chatgpt.com/c/694ec8e7-fb10-8321-a1d5-94b7e0686edf
export const eventCreate = async (req, res) => {
    const discoverabilityMap = {
        PUBLIC: true,
        PRIVATE: false,
      };


    try {
        const user = req.user;
        console.log("User Data -->", user);

        if(!user){
            console.log("User Data -->", user);
            return res.status(401).json({
                message: "USER_NOT_EXIST"
            });
        }

        const {
            title,
            description,
            venue,
            startDate,
            endDate,
            evType,
            price,
            organizerId,
            shareCode,
            isDiscoverable: clientDiscoverable,
            approvalStatus,
            approvedBy,
            approvedAt
        } = req.body;


       const isDiscoverable = evType in discoverabilityMap
            ? discoverabilityMap[evType]
            : Boolean(clientDiscoverable);


        let approveStatus;
        let approveBy;
        let approveAt;
        if (user.platformRole === "ADMIN" || user.platformRole === "ORGANIZER"){
            approveStatus = "APPROVED";
            approveBy = user.id;
            approveAt = new Date();
        }


        const event = await prisma.event.create({
            data: {
                title,
                description,
                venue,
                startDate,
                endDate,
                evType,
                isDiscoverable,
                price,
                shareCode,
                organizerId,
                approvalStatus: approveStatus,
                approvedBy: approveBy,
                approvedAt: approveAt,
                createdBy: user.id,
              },
        });

        return res.status(201).json({
            message: "EVENT_CREATED",
            event,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "EVENT_CREATE_FAILED",
        });
      }
    }
