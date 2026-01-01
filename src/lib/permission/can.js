import { resolvePermissions } from "./permission.resolver.js";

export function can(permission, context){
    const permissions = resolvePermissions(context);
    return permissions.includes(permission)
};
