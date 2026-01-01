import { PlatformRolePermission } from "./platformRole.permission.js";
import { EventRolePermission } from "./eventRole.permission.js";

export function resolvePermissions({
    platformRole,
    eventRole,
    isEventStaff = false
}){
    if (!platformRole) {
        throw new Error("PLATFORM_ROLE_MISSING_IN_PERMISSION_CONTEXT");
    }

    const basePermission = PlatformRolePermission[platformRole] ?? [];

    const eventPermission = isEventStaff && eventRole
    ? EventRolePermission[eventRole] ?? []
    : [];

    return [...new Set([...basePermission, ...eventPermission])];
}
