import express, { Application, NextFunction, Request, Response } from "express";
import { UserRoute } from "./controllers/users/user.route.js";

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
        })

        const usersRoute = new UserRoute();
        this.host.use(`/api/${usersRoute.path}`, usersRoute.router);

        this.host.use((req: Request, res: Response, next: NextFunction) => {
            res.status(404).send("No Endpoint found");
        });

        // Previous middleware will be skipped if we call `next` with an extra parameter
        this.host.use((error, req, res, next) => {
            res.status(400).json(error);
        });
    }

    listen() {
        this.host.listen(3000, () => {
            console.info(`🚀 http://localhost:3000`);
            console.info(`========================`);
        })
    }
}