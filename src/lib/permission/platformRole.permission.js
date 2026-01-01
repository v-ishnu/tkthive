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
        Permission.MANAGE_OWN_EVENT,
    ],

    ORGANIZER:[
        Permission.CREATE_EVENT,
        Permission.MANAGE_OWN_EVENT,
        Permission.VIEW_REPORTS
    ],
    USER:[
        Permission.CREATE_BOOKING
    ]
}
