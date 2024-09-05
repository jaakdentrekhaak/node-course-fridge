import { UserStore } from "./user.store.js";
export const getList = (search)=>{
    const users = UserStore.find(search);
    return [
        users,
        users.length
    ];
};

//# sourceMappingURL=getList.handler.js.map