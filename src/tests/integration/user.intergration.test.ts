import supertest from "supertest";
import { App } from "../../app.js";
import TestAgent from "supertest/lib/agent.js";
import {
  User,
  UserStore,
} from "../../controllers/users/handlers/user.store.js";
import { expect } from "chai";
import { StatusCode } from "@panenco/papi";

describe("Integration tests", () => {
  describe("User Tests", () => {
    let request: TestAgent<supertest.Test>;
    beforeEach(() => {
      UserStore.users = [];
      const app = new App();

      request = supertest(app.host);
    });

    it("should CRUD users", async () => {
      // create new user
      const { body: createResponse } = await request
        .post(`/api/users`)
        .send({
          name: "test",
          email: "test-user+1@panenco.com",
          password: "real secret stuff",
        } as Omit<User, "id">)
        .expect(StatusCode.created);

      expect(UserStore.users.some((x) => x.email === createResponse.email))
        .true;

      // Log created user in
      const { body: loginBody } = await request
        .post(`/api/auth/tokens`)
        .send({
          email: "test-user+1@panenco.com",
          password: "real secret stuff",
        })
        .expect(StatusCode.ok);

      const token = loginBody.token;

      // Get the newly created user
      const { body: getResponse } = await request
        .get(`/api/users/${createResponse.id}`)
        .set("x-auth", token)
        .expect(StatusCode.ok);
      expect(getResponse.name).equal("test");

      // Successfully update user
      const { body: updateResponse } = await request
        .patch(`/api/users/${createResponse.id}`)
        .send({
          email: "test-user+updated@panenco.com",
        } as Omit<User, "id" | "name">)
        .set("x-auth", token)
        .expect(StatusCode.ok);

      expect(updateResponse.name).equal("test");
      expect(updateResponse.email).equal("test-user+updated@panenco.com");
      expect(updateResponse.password).undefined; // middleware transformed the object to not include the password

      // Get all users
      const { body: getAllResponse } = await request
        .get(`/api/users`)
        .set("x-auth", token)
        .expect(200);

      const { items, count } = getAllResponse;

      const newUser = items.find((x: User) => x.name === getResponse.name);
      expect(newUser).not.undefined;
      expect(newUser.email).equal("test-user+updated@panenco.com");
      expect(count).equal(1);

      // Get the newly created user
      await request
        .delete(`/api/users/${createResponse.id}`)
        .set("x-auth", token)
        .expect(204);

      // Get all users again after deleted the only user
      const { body: getNoneResponse } = await request
        .get(`/api/users`)
        .set("x-auth", token)
        .expect(200);
      const { count: getNoneCount } = getNoneResponse;
      expect(getNoneCount).equal(0);
    });
  });
});
