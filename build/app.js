import "express-async-errors";
import express from "express";
import { UserController } from "./controllers/users/user.controller.js";
import { getMetadataArgsStorage, useExpressServer } from "routing-controllers";
import { errorMiddleware, getAuthenticator } from "@panenco/papi";
import { AuthController } from "./controllers/auth/auth.controller.js";
import { validationMetadatasToSchemas } from "class-validator-jsonschema";
import { getMetadataStorage } from "class-validator";
import swaggerUi from "swagger-ui-express";
import { routingControllersToSpec } from "routing-controllers-openapi";
export class App {
    host;
    constructor(){
        // init server
        this.host = express();
        this.host.use(express.json());
        this.host.use((req, res, next)=>{
            console.log(req.method, req.url);
            next();
        });
        this.host.get("/", (req, res, next)=>{
            res.send("Hello World!");
        });
        this.initializeControllers([
            AuthController,
            UserController
        ]);
        this.host.use(errorMiddleware);
        this.initializeSwagger();
    }
    listen() {
        this.host.listen(3000, ()=>{
            console.info(`🚀 http://localhost:3000`);
            console.info(`========================`);
        });
    }
    initializeControllers(controllers) {
        useExpressServer(this.host, {
            // Link the express host to routing-controllers
            cors: {
                origin: "*",
                exposedHeaders: [
                    "x-auth"
                ]
            },
            controllers,
            defaultErrorHandler: false,
            routePrefix: "/api",
            authorizationChecker: getAuthenticator("very_secret")
        });
    }
    initializeSwagger() {
        const schemas = validationMetadatasToSchemas({
            classValidatorMetadataStorage: getMetadataStorage(),
            refPointerPrefix: "#/components/schemas/"
        });
        const routingControllersOptions = {
            routePrefix: "/api"
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
                        description: 'JWT Authorization header using the JWT scheme. Example: "x-auth: {token}"'
                    }
                }
            },
            security: [
                {
                    JWT: []
                }
            ]
        });
        this.host.use("/docs", swaggerUi.serve, swaggerUi.setup(spec));
    }
}

//# sourceMappingURL=app.js.map