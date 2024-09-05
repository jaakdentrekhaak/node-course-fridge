import { UserStore } from "./user.store.js";
export const create = async (body)=>{
    const user = UserStore.add(body);
    return user;
};

//# sourceMappingURL=create.handler.js.map