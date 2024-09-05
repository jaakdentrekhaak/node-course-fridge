import { UserStore } from "./user.store.js";
export const deleteUser = (id)=>{
    UserStore.delete(Number(id));
};

//# sourceMappingURL=delete.handler.js.map