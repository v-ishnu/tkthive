import { Permission } from "./permission.js";

export const PlatformRolePermission = {
    SUPER_ADMIN: Object.values(Permission),

    ADMIN: [
        Permission.VIEW_ALL_ORGANIZERS,
        Permission.VIEW_ALL_EVENTS,
        Permission.APPROVE_EVENT,
        Permission.VIEW_REPORTS,
        Permission.MANAGE_ORGANIZER,
        Permission.CREATE_ORGANIZER,
        Permission.CREATE_EVENT,
        Permission.MANAGE_EVENT,
        Permission.CONFIRM_BOOKING, // ✅ Added
    ],

    ORGANIZER: [
        Permission.CREATE_EVENT,
        Permission.MANAGE_EVENT,
        Permission.VIEW_REPORTS,
        Permission.MANAGE_ORGANIZER,
        Permission.CREATE_ORGANIZER
    ],
    USER: [
        Permission.CREATE_BOOKING
    ]
}
