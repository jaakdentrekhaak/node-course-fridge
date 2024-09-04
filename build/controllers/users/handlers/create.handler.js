import { UserStore } from "./user.store.js";
import { plainToInstance } from "class-transformer";
import { UserBody } from "../../../contracts/user.body.js";
import { validate } from "class-validator";
import { UserView } from "../../../contracts/user.view.js";
export const create = async (req, res, next)=>{
    const transformed = plainToInstance(UserBody, req.body);
    const validationErrors = await validate(transformed, {
        skipMissingProperties: false,
        whitelist: true,
        forbidNonWhitelisted: true
    });
    if (validationErrors.length) {
        return next(validationErrors);
    }
    const user = UserStore.add(transformed);
    res.json(plainToInstance(UserView, user));
};

//# sourceMappingURL=create.handler.js.map