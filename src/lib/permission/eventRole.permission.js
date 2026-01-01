import { Permission } from "./permission.js";

export const EventRolePermission = {
    MANAGER: [
        Permission.MANAGE_OWN_EVENT,
        Permission.VIEW_REPORTS
    ],
    SCANNER: [
        Permission.SCAN_TICKET
    ],
};
