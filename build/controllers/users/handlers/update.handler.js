import { UserStore } from "./user.store.js";
export const update = async (req, res, next)=>{
    const id = Number(req.params.id);
    const user = UserStore.get(id);
    if (!user) {
        return res.status(404).json({
            error: `User with id ${req.params.id} doesn't exist`
        });
    }
    console.log(req.body);
    const updated = UserStore.update(id, req.body);
    res.locals.body = updated;
    next();
};

//# sourceMappingURL=update.handler.js.map