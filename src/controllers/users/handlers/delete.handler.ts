import { NextFunction, Request, Response } from "express";
import { UserStore } from "./user.store.js"

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    UserStore.delete(parseInt(req.params.id));
    res.send("OK");
}