import { UserStore } from "./user.store.js"

export const update = async (req, res, next) => {
    const user = UserStore.get(req.params.id);
    if (!user) {
        return res.status(404).json({message: `User with id ${req.params.id} doesn't exist`})
    }
    const userUpdated = UserStore.update(req.params.id, req.body);
    res.json(userUpdated);
}