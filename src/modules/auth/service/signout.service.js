import { deleteRedisToken } from "../../../lib/store.redis.js";


export const signOutService = async (refreshToken) => {

    if(!refreshToken) return;

    await deleteRedisToken(rToken);
}
