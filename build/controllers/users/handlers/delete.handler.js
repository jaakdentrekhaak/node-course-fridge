import { UserStore } from "./user.store.js";
export const deleteUser = async (req, res, next)=>{
    UserStore.delete(parseInt(req.params.id));
    res.send("OK");
};

//# sourceMappingURL=delete.handler.js.map