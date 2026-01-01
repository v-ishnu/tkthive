import {z} from 'zod';

export const organizationSchema = z.object({
    name: z.string().min(1, "Organization name is required"),
    OrganizerType: z.nativeEnum(OrganizerType),
});
