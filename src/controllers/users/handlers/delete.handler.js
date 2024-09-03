import { UserStore } from "./user.store.js"

export const deleteUser = async (req, res, next) => {
    UserStore.delete(req.params.id);
    res.send("OK");
}