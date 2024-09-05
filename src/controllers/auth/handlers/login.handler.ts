import { createAccessToken, Unauthorized } from "@panenco/papi";
import { LoginBody } from "../../../contracts/login.body.js";
import { RequestContext } from "@mikro-orm/core";
import { User } from "../../../entities/user.entity.js";

export const login = async (loginBody: LoginBody) => {
  const user = await RequestContext.getEntityManager().findOne(User, {
    email: loginBody.email,
  });

  if (!user) {
    throw new Unauthorized("unauthorized", "User not found");
  }

  if (user.password != loginBody.password) {
    throw new Unauthorized("unauthorized", "Incorrect password");
  }

  return await createAccessToken("very_secret", 10 * 60, { userId: user.id });
};
