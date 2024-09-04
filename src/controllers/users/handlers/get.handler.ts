import { NextFunction, Request, Response } from "express";
import { UserStore } from "./user.store.js";

export const get = (req: Request, res: Response, next: NextFunction) => {
  const user = UserStore.get(parseInt(req.params.id));
  if (!user) {
    return res
      .status(404)
      .json({ message: `User with id ${req.params.id} doesn't exist` });
  }
  res.json(user);
};
