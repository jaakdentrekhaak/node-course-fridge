import { getList } from "./handlers/getList.handler.js";
import { create } from "./handlers/create.handler.js";
import { get } from "./handlers/get.handler.js";
import { update } from "./handlers/update.handler.js";
import { deleteUser } from "./handlers/delete.handler.js";
import { UserBody } from "../../contracts/user.body.js";
import { UserView } from "../../contracts/user.view.js";
import {
  Authorized,
  Delete,
  Get,
  JsonController,
  Param,
  Patch,
  Post,
} from "routing-controllers";
import {
  Body,
  ListRepresenter,
  Query,
  Representer,
  StatusCode,
} from "@panenco/papi";
import { SearchQuery } from "../../contracts/search.query.js";
import { OpenAPI } from "routing-controllers-openapi";

@JsonController("/users")
export class UserController {
  @Post()
  @Representer(UserView, StatusCode.created)
  @OpenAPI({ summary: "Create a new user" })
  async create(@Body() body: UserBody) {
    return create(body);
  }

  @Get()
  @ListRepresenter(UserView)
  @Authorized()
  async getList(@Query() query: SearchQuery) {
    return getList(query.search);
  }

  @Get("/:id")
  @Representer(UserView)
  @Authorized()
  async get(@Param("id") id: string) {
    return get(id);
  }

  @Patch("/:id")
  @Representer(UserView)
  @Authorized()
  async update(
    @Body({}, { skipMissingProperties: true }) body: UserBody,
    @Param("id") id: string
  ) {
    return update(body, id);
  }

  @Delete("/:id")
  @Representer(null)
  @Authorized()
  async delete(@Param("id") id: string) {
    return deleteUser(id);
  }
}
