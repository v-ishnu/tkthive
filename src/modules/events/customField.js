import { prisma } from "../../../config/prisma.js";

export const createCustomField = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { label, type, required, options = [], order, ticketId, scope, placeholder } = req.body;

    const event = await prisma.event.findUnique({ where: { id: eventId } });

    if (!event) throw new Error("EVENT_NOT_FOUND")

    // if (!event.hasCustomFields) throw new Error("CUSTOM_FIELD_DISABLE");

    const registrationCount = await prisma.eventRegistration.count({
      where: { eventId }
    });

    if (registrationCount > 0) {
      throw new Error("CUSTOM_FIELDS_LOCKED");
    }

    // Transform type: convert SELECT to DROPDOWN to match Prisma enum
    let fieldType = type;
    if (fieldType === 'SELECT' || fieldType === 'select') {
      fieldType = 'DROPDOWN';
    }

    const field = await prisma.eventCustomField.create({
      data: {
        eventId,
        ticketId, // Optional link to specific ticket
        label,
        scope,
        placeholder,
        type: fieldType,
        required: required ?? false,
        options,
        order
      }
    });

    // Auto-enable custom fields on the event
    if (!event.hasCustomFields) {
      await prisma.event.update({
        where: { id: eventId },
        data: { hasCustomFields: true }
      });
    }

    res.status(201).json({
      message: "CUSTOM_FIELD_CREATED",
      field
    });

  } catch (err) {
    console.log(err.message)
    res.status(400).json({ message: err.message });
  }
};


export const createBulkCustomFields = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { fields } = req.body; // Expecting an array of fields

    if (!Array.isArray(fields) || fields.length === 0) {
      return res.status(400).json({ message: "INVALID_FIELDS_DATA" });
    }

    const event = await prisma.event.findUnique({ where: { id: eventId } });

    if (!event) throw new Error("EVENT_NOT_FOUND");

    const registrationCount = await prisma.eventRegistration.count({
      where: { eventId }
    });

    if (registrationCount > 0) {
      throw new Error("CUSTOM_FIELDS_LOCKED");
    }

    // Prepare data for bulk creation
    // map fields to include eventId and defaults
    const fieldsData = fields.map(field => {
      // Transform type: convert SELECT to DROPDOWN to match Prisma enum
      let fieldType = field.type;
      if (fieldType === 'SELECT' || fieldType === 'select') {
        fieldType = 'DROPDOWN';
      }

      return {
        eventId,
        ticketId: field.ticketId || null,
        label: field.label,
        scope: field.scope,
        placeholder: field.placeholder,
        type: fieldType,
        required: field.required ?? false,
        options: field.options || [],
        order: field.order || 0
      };
    });

    // Use transaction or createMany
    const createdFields = await prisma.eventCustomField.createMany({
      data: fieldsData
    });

    // Auto-enable custom fields on the event
    if (!event.hasCustomFields) {
      await prisma.event.update({
        where: { id: eventId },
        data: { hasCustomFields: true }
      });
    }

    res.status(201).json({
      message: "BULK_CUSTOM_FIELDS_CREATED",
      count: createdFields.count
    });

  } catch (err) {
    console.log(err.message)
    res.status(400).json({ message: err.message });
  }
};


export async function updateCustomField(req, res) {
  try {
    const { fieldId } = req.params;
    const updates = req.body;

    const field = await prisma.eventCustomField.findUnique({
      where: { id: fieldId },
      include: { event: true }
    });

    if (!field) throw new Error("FIELD_NOT_FOUND");
    if (!field.event.hasCustomFields) throw new Error("CUSTOM_FIELD_DISABLE");

    // optional lock after registation
    const registrationCount = await prisma.eventRegistration.count({
      where: { eventId: field.id }
    });

    if (registrationCount > 0) throw new Error("CUSTOM_FIELDS_LOCKED");

    const updated = await prisma.eventCustomField.update({
      where: { id: fieldId },
      data: updates
    });

    return res.status(200).json({
      message: "CUSTOM_FIELD_UPDATED",
      field: updated
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}


// Delete Custom Field
export async function deleteCustomField(req, res) {
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
