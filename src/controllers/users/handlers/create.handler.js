import { UserStore } from "./user.store.js"

export const create = async (req, res, next) => {
    if (!Object.keys(req.body).includes("name")) {
        return next({error: "User must have a name"});
    }
    const user = UserStore.add(req.body);
    res.json(user);
}