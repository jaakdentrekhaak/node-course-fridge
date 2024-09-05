import { UserStore } from "./user.store.js";
import { NotFound } from "@panenco/papi";
export const update = (body, idString)=>{
    const id = Number(idString);
    const user = UserStore.get(id);
    if (!user) {
        throw new NotFound("userNotFound", "User not found");
    }
    const updated = UserStore.update(id, {
        ...user,
        ...body
    });
    return updated;
};

//# sourceMappingURL=update.handler.js.map