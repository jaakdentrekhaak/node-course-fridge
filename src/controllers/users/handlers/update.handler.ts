import { NextFunction, Request, Response } from "express";
import { UserBody } from "../../../contracts/user.body.js";
import { NotFound } from "@panenco/papi";
import { RequestContext } from "@mikro-orm/core";
import { User } from "../../../entities/user.entity.js";

export const update = async (body: UserBody, id: string) => {
  const em = RequestContext.getEntityManager();
  const user = await em.findOne(User, { id });

  if (!user) {
    throw new NotFound("userNotFound", "User not found");
  }
  user.assign(body);
  await em.flush();
  return user;
};
