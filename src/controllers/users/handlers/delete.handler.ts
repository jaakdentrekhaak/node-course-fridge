import { NextFunction, Request, Response } from "express";
import { RequestContext } from "@mikro-orm/core";
import { User } from "../../../entities/user.entity.js";
import { NotFound } from "@panenco/papi";

export const deleteUser = async (id: string) => {
  const em = RequestContext.getEntityManager();
  const user = await em.findOne(User, { id });
  if (!user) {
    throw new NotFound("userNotFound", "User not found");
  }
  await em.removeAndFlush(user);
};
