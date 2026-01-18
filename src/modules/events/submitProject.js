import { prisma } from "../../../config/prisma.js";

export const submitProject = async (req, res) => {
    try {
        const { eventId } = req.params;
        const userId = req.user.id;
        const submissionData = req.body; // The form data

        // 1. Check if user is registered for the event
        // We look for a confirmed registration
        const registration = await prisma.eventRegistration.findFirst({
            where: {
                eventId: eventId,
                userId: userId,
                status: "CONFIRMED"
            }
        });

        if (!registration) {
            return res.status(403).json({ message: "NOT_REGISTERED_OR_CONFIRMED" });
        }

        // 2. Fetch the Submission Configuration (EventTab)
        const submissionTab = await prisma.eventTab.findFirst({
            where: {
                eventId: eventId,
                key: "SUBMISSIONS",
                isActive: true
            }
        });

        if (!submissionTab || !submissionTab.data) {
            return res.status(404).json({ message: "SUBMISSION_NOT_CONFIGURED" });
        }

        const config = submissionTab.data; // The 'data' from the user provided JSON

        // 3. Validation
        // Check Deadline
        if (config.info && config.info.deadline) {
            const deadline = new Date(config.info.deadline);
            if (new Date() > deadline) {
                return res.status(400).json({ message: "SUBMISSION_DEADLINE_PASSED" });
            }
        }

        // Check Max Submissions (if enforced)
        if (submissionTab.schema && submissionTab.schema.maxSubmissions) {
            // Logic to check previous submissions could go here if we stored historicals, 
            // but we only store one "submissions" object per registration currently.
            // If we wanted to block updates:
            // if (registration.submissions && someCheck) ...
            // For now, we allow overwriting (updating) the submission.
        }

        // Validate Fields
        const fields = config.fields || [];
        const missingFields = [];

        for (const field of fields) {
            if (field.required) {
                const value = submissionData[field.name];
                if (value === undefined || value === null || value === "") {
                    missingFields.push(field.label || field.name);
                }
            }
        }

        if (missingFields.length > 0) {
            return res.status(400).json({
                message: "MISSING_REQUIRED_FIELDS",
                fields: missingFields
            });
        }

        // 4. Save Submission
        // We update the existing registration with the new submission data
        const updatedRegistration = await prisma.eventRegistration.update({
            where: { id: registration.id },
            data: {
                submissions: {
                    ...submissionData,
                    submittedAt: new Date(),
                }
            }
        });

        return res.json({
            message: "SUBMISSION_SUCCESS",
            data: updatedRegistration.submissions
        });

    } catch (error) {
        console.error("Submit Project Error:", error);
        return res.status(500).json({ message: "INTERNAL_SERVER_ERROR" });
    }
};
