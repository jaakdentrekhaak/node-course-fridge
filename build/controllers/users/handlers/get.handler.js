import { UserStore } from "./user.store.js";
import { NotFound } from "@panenco/papi";
export const get = (id)=>{
    const user = UserStore.get(Number(id));
    if (!user) {
        throw new NotFound("userNotFound", "User not found");
    }
    return user;
};

//# sourceMappingURL=get.handler.js.map