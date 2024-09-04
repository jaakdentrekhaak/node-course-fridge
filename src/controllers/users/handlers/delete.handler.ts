import { NextFunction, Request, Response } from "express";
import { UserStore } from "./user.store.js";

export const deleteUser = (req: Request, res: Response, next: NextFunction) => {
  UserStore.delete(parseInt(req.params.id));
  res.status(204).send("OK");
};
