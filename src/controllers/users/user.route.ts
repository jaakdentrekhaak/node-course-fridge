import { NextFunction, Request, Response, Router } from "express";
import { getList } from "./handlers/getList.handler.js";
import { create } from "./handlers/create.handler.js";
import { get } from "./handlers/get.handler.js";
import { update } from "./handlers/update.handler.js";
import { deleteUser } from "./handlers/delete.handler.js";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { UserBody } from "../../contracts/user.body.js";
import { UserView } from "../../contracts/user.view.js";

const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.header("x-auth") !== "api-key") {
    return res.status(401).send("Unauthorized");
  }
  next();
};

const patchValidationMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const transformed = plainToInstance(UserBody, req.body, {
    // undefined properties not taken into account
    exposeUnsetFields: false,
  });
  const validationErrors = await validate(transformed, {
    // missing properties not validated -> we wouldn't want this when creating an entity for example
    skipMissingProperties: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  });
  if (validationErrors.length) {
    return next(validationErrors);
  }
  res.locals.body = transformed;
  next();
};

const representationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const transformed = plainToInstance(UserView, res.locals.body); // Note the use of res.locals here. Locals is a way to transport data from one middleware to another.
  res.json(transformed);
};

export class UserRoute {
  router: Router;
  path: String;
  constructor() {
    this.router = Router();
    this.path = "users";

    this.router.get("/", getList);
    this.router.post("/", adminMiddleware, create);
    this.router.get("/:id", get);
    this.router.patch(
      "/:id",
      patchValidationMiddleware,
      update,
      representationMiddleware
    );
    this.router.delete("/:id", deleteUser);
  }
}
