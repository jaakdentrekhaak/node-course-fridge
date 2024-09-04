import { expect } from "chai";
import {
  User,
  UserStore,
} from "../../controllers/users/handlers/user.store.js";
import { getList } from "../../controllers/users/handlers/getList.handler.js";
import { NextFunction, Request, Response } from "express";
import { get } from "../../controllers/users/handlers/get.handler.js";
import { UserBody } from "../../contracts/user.body.js";
import { create } from "../../controllers/users/handlers/create.handler.js";
import { UserView } from "../../contracts/user.view.js";
import { update } from "../../controllers/users/handlers/update.handler.js";
import { deleteUser } from "../../controllers/users/handlers/delete.handler.js";

const userFixtures: User[] = [
  {
    name: "test1",
    email: "test-user+1@panenco.com",
    id: 0,
    password: "password1",
  },
  {
    name: "test2",
    email: "test-user+2@panenco.com",
    id: 1,
    password: "password2",
  },
];

describe("Handler tests", () => {
  describe("User tests", () => {
    beforeEach(() => {
      UserStore.users = [...userFixtures];
    });

    it("should get users", () => {
      let res: User[];
      getList(
        { query: {} as any } as Request,
        { json: (val) => (res = val) } as Response,
        null as NextFunction
      );

      expect(res.some((x) => x.name === "test2")).true;
    });

    it("should search users", () => {
      let res: User[];
      getList(
        { query: { search: "test1" } as any } as Request,
        { json: (val) => (res = val) } as Response,
        null as NextFunction
      );

      expect(res.some((x) => x.name === "test1")).true;
    });

    it("should get user by id", () => {
      let res: User;
      get(
        { params: { id: "1" } as any } as Request,
        { json: (val) => (res = val) } as Response,
        null as NextFunction
      );

      expect(res.name).equal("test2");
    });

    it("should fail when getting user by unknown id", () => {
      let res: any;
      const id = "10";
      get(
        { params: { id: id } as any } as Request,
        { status: (s) => ({ json: (val) => (res = val) }) } as Response,
        null as NextFunction
      );

      expect(res.message).equal(`User with id ${id} doesn't exist`);
    });

    it("should create user", async () => {
      let res: UserView;
      const body: Omit<User, "id"> = {
        name: "test3",
        email: "test-user+3@panenco.com",
        password: "password3",
      };
      await create(
        { body } as Request,
        {
          json: (val) => (res = val),
        } as Response,
        null as NextFunction
      );
      expect(res.name).equal("test3");
    });

    it("should update user", async () => {
      const body: Omit<User, "name" | "password" | "id"> = {
        email: "test-user+updated@panenco.com",
      };
      const res = {
        locals: {
          body: body,
        },
      } as unknown as Response;
      const id = 0;
      update(
        {
          body,
          params: { id } as any,
        } as Request,
        res,
        () => null as NextFunction
      );

      expect(res.locals.body.email).equal(body.email);
      expect(res.locals.body.name).equal("test1");
      expect(UserStore.users.find((x) => x.id === id).email).equal(body.email);
    });

    it("should delete user by id", () => {
      const initialCount = UserStore.users.length;
      let status: number;
      let message: string;
      const res = {
        status: (code: number) => {
          status = code;
          return {
            send: (data: any) => {
              message = data;
            },
          };
        },
      } as Response;
      deleteUser(
        { params: { id: "1" } as any } as Request,
        res,
        null as NextFunction
      );

      expect(UserStore.users.some((x) => x.id === 1)).false;
      expect(initialCount - 1).equal(UserStore.users.length);
      expect(status).equal(204);
      expect(message).equal("OK");
    });
  });
});
