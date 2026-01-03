import {prisma} from "../../../config/prisma.js";

export const createCustomField = async (req, res) => {
    try {
        const {eventId} = req.params;
        const {label, type, required, options=[], order} = req.body;

        const event = await prisma.event.findUnique({where: {id: eventId}});

        if(!event) throw new Error("EVENT_NOT_FOUND")

        if (!event.hasCustomFields) throw new Error("CUSTOM_FIELD_DISABLE");

        const registrationCount = await prisma.eventRegistration.count({
            where: { eventId }
        });

        if (registrationCount > 0) {
            throw new Error("CUSTOM_FIELDS_LOCKED");
        }

        const field = await prisma.eventCustomField.create({
            data: {
              eventId,
              label,
              type,
              required: required ?? false,
              options,
              order
            }
        });
        res.status(201).json({
            message: "CUSTOM_FIELD_CREATED",
            field
          });

    } catch (err) {
        console.log(err.message)
        res.status(400).json({ message: err.message });
    }
};


export async function updateCustomField(req, res){
    try {
        const { fieldId } = req.params;
        const updates = req.body;

        const field = await prisma.eventCustomField.findUnique({
            where: {id: fieldId},
            include: {event : true}
        });

        if(!field) throw new Error("FIELD_NOT_FOUND");
        if (!field.event.hasCustomFields) throw new Error("CUSTOM_FIELD_DISABLE");

        // optional lock after registation
        const registrationCount = await prisma.eventRegistration.count({
            where: { eventId: field.id }
        });

        if(registrationCount > 0) throw new Error("CUSTOM_FIELDS_LOCKED");

        const updated = await prisma.eventCustomField.update({
            where: {id : fieldId},
            data: updates
        });

        return res.status(200).json({
            message: "CUSTOM_FIELD_UPDATED",
            field: updated
        });
    } catch (error) {
        res.status(400).json({message: error.message});
    }
}


// Delete Custom Field
export async function deleteCustomField(req, res){
    try {
      const { fieldId } = req.params;

      const field = await prisma.eventCustomField.findUnique({
        where: { id: fieldId },
        include: { event: true }
      });

      if (!field) throw new Error("FIELD_NOT_FOUND");
      if (!field.event.hasCustomFields) throw new Error("CUSTOM_FIELDS_DISABLED");

      // Optional: lock after registrations
      const registrationCount = await prisma.eventRegistration.count({
        where: { eventId: field.eventId }
      });
      if (registrationCount > 0) {
        throw new Error("CUSTOM_FIELDS_LOCKED");
      }

      await prisma.eventCustomField.delete({
        where: { id: fieldId }
      });

      res.json({
        message: "CUSTOM_FIELD_DELETED"
      });

    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };
