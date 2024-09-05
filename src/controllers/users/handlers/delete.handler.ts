import { NextFunction, Request, Response } from "express";
import { UserStore } from "./user.store.js";

export const deleteUser = (id: string) => {
  UserStore.delete(Number(id));
};
