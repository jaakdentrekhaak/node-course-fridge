import { NextFunction, Request, Response } from "express";
import { UserStore } from "./user.store.js";
import { NotFound } from "@panenco/papi";

export const get = (id: string) => {
  const user = UserStore.get(Number(id));
  if (!user) {
    throw new NotFound("userNotFound", "User not found");
  }
  return user;
};
