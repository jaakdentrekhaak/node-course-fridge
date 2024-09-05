import "express-async-errors";
import express, { Application, NextFunction, Request, Response } from "express";
import { UserController } from "./controllers/users/user.controller.js";
import {
  getMetadataArgsStorage,
  RoutingControllersOptions,
  useExpressServer,
} from "routing-controllers";
import { errorMiddleware, getAuthenticator } from "@panenco/papi";
import { AuthController } from "./controllers/auth/auth.controller.js";
import { validationMetadatasToSchemas } from "class-validator-jsonschema";
import { getMetadataStorage } from "class-validator";
import swaggerUi from "swagger-ui-express";
import { routingControllersToSpec } from "routing-controllers-openapi";

export class App {
  host: Application;
  constructor() {
    // init server
    this.host = express();
    this.host.use(express.json());

    this.host.use((req: Request, res: Response, next: NextFunction) => {
      console.log(req.method, req.url);
      next();
    });

    this.host.get("/", (req: Request, res: Response, next: NextFunction) => {
      res.send("Hello World!");
    });

    this.initializeControllers([AuthController, UserController]);

    this.host.use(errorMiddleware);

    this.initializeSwagger();
  }

  listen() {
    this.host.listen(3000, () => {
      console.info(`🚀 http://localhost:3000`);
      console.info(`========================`);
    });
  }

  private initializeControllers(controllers: Function[]) {
    useExpressServer(this.host, {
      // Link the express host to routing-controllers
      cors: {
        origin: "*",
        exposedHeaders: ["x-auth"],
      },
      controllers,
      defaultErrorHandler: false, // Disable the default error handler. We will handle errors through papi.
      routePrefix: "/api",
      authorizationChecker: getAuthenticator("very_secret"), // Tell routing-controllers to use the papi authentication checker
    });
  }

  private initializeSwagger() {
    const schemas = validationMetadatasToSchemas({
      classValidatorMetadataStorage: getMetadataStorage(),
      refPointerPrefix: "#/components/schemas/",
    });

    const routingControllersOptions: RoutingControllersOptions = {
      routePrefix: "/api",
    };

    const storage = getMetadataArgsStorage();
    const spec = routingControllersToSpec(storage, routingControllersOptions, {
      components: {
        schemas,
        securitySchemes: {
          JWT: {
            in: "header",
            name: "x-auth",
            type: "apiKey",
            bearerFormat: "JWT",
            description:
              'JWT Authorization header using the JWT scheme. Example: "x-auth: {token}"',
          },
        },
      },
      security: [{ JWT: [] }],
    });

    this.host.use("/docs", swaggerUi.serve, swaggerUi.setup(spec));
  }
}
