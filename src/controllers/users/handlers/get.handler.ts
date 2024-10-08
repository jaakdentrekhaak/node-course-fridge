import { NextFunction, Request, Response } from "express";
import { NotFound } from "@panenco/papi";
import { RequestContext } from "@mikro-orm/core";
import { User } from "../../../entities/user.entity.js";

export const get = async (id: string) => {
  const em = RequestContext.getEntityManager();
  const user = await em.findOne(User, { id });
  if (!user) {
    throw new NotFound("userNotFound", "User not found");
  }
  return user;
};
