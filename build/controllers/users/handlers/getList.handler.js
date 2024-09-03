import { UserStore } from "./user.store.js";
export const getList = async (req, res, next)=>{
    const users = UserStore.find(req.query.search?.toString());
    res.json(users);
};

//# sourceMappingURL=getList.handler.js.map