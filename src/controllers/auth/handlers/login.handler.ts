import { createAccessToken, Unauthorized } from "@panenco/papi";
import { LoginBody } from "../../../contracts/login.body.js";
import { UserStore } from "../../users/handlers/user.store.js";

export const login = async (loginBody: LoginBody) => {
  const user = UserStore.getByEmail(loginBody.email);

  if (!user) {
    throw new Unauthorized("unauthorized", "User not found");
  }

  if (user.password != loginBody.password) {
    throw new Unauthorized("unauthorized", "Incorrect password");
  }

  return await createAccessToken("very_secret", 10 * 60, { userId: user.id });
};
