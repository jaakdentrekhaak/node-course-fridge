import { Representer } from "@panenco/papi";
import { Body, JsonController, Post } from "routing-controllers";
import { AccessTokenView } from "../../contracts/accessToken.view.js";
import { LoginBody } from "../../contracts/login.body.js";
import { login } from "./handlers/login.handler.js";

@JsonController("/auth")
export class AuthController {
  @Post("/tokens")
  @Representer(AccessTokenView)
  async create(@Body() body: LoginBody) {
    return login(body);
  }
}
