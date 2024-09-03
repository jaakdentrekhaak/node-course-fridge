import { Router } from "express";
import { getList } from "./handlers/getList.handler.js"
import { create } from "./handlers/create.handler.js";
import { get } from "./handlers/get.handler.js";
import { update } from "./handlers/update.handler.js";
import { deleteUser } from "./handlers/delete.handler.js";

const adminMiddleware = (req, res, next) => {
	if (req.header("x-auth") !== "api-key") {
		return res.status(401).send("Unauthorized");
	}
	next();
};

export class UserRoute {
    constructor() {
        this.router = Router();
        this.path = "users";
        
        this.router.get("/", getList);
        this.router.post("/", adminMiddleware, create);
        this.router.get("/:id", get);
        this.router.patch("/:id", update);
        this.router.delete("/:id", deleteUser);
    }
}
