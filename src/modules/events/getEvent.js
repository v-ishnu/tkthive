import {prisma} from "../../../config/prisma.js";

export const getEvent = async(req, res ) => {
    try {
        const events = await prisma.event.findMany({
            include:{
                tickets: true,
                organizer:{
                    select:{
                        id: true,
                        name: true,
                        type: true
                    },
                },
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return res.status(200).json({
            message: "EVENTS_FETCHED",
            count: events.length,
            events
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "EVENT_FETCH_FAILED"
        });
    }
};


export const getEventById = async(req, res) => {
    try {
        const {eventId} = req.params;

        if(!eventId){
            throw new Error("EVENTID_NULL");
        }

        const event = await prisma.event.findUnique({
            where: { id: eventId },
            include: {
              tickets: true,
              organizer: {
                select: {
                  id: true,
                  name: true,
                  type: true,
                },
              },
            },
          });


        return res.status(201).json({
            message: "EVENT_FETCHED",
            event,
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "EVENT_FATCH_FAILED"
        });
    }
}
