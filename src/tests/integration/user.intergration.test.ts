import supertest from "supertest";
import { App } from "../../app.js";
import TestAgent from "supertest/lib/agent.js";
import { expect } from "chai";
import { StatusCode } from "@panenco/papi";
import { MikroORM } from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { User } from "../../entities/user.entity.js";

describe("Integration tests", () => {
  describe("User Tests", () => {
    let request: TestAgent<supertest.Test>;
    let orm: MikroORM<PostgreSqlDriver>;
    before(async () => {
      const app = new App();
      await app.createConnection();
      orm = app.orm;
      request = supertest(app.host);
    });

    beforeEach(async () => {
      await orm.em.execute(`DROP SCHEMA public CASCADE; CREATE SCHEMA public;`);
      await orm.getMigrator().up();
    });

    it("should CRUD users", async () => {
      // create new user
      const { body: createResponse } = await request.post(`/api/users`).send({
        name: "test",
        email: "test-user+1@panenco.com",
        password: "real secret stuff",
      } as Omit<User, "id">);

      const createdUser = await orm.em
        .fork()
        .findOne(User, { id: createResponse.id });
      expect(createdUser.name).equal("test");

      // login user
      const { body: loginBody } = await request
        .post(`/api/auth/tokens`)
        .send({
          email: "test-user+1@panenco.com",
          password: "real secret stuff",
        })
        .expect(StatusCode.ok);

      const token = loginBody.token;

      // get newly created user
      const { body: getResponse } = await request
        .get(`/api/users/${createResponse.id}`)
        .set("x-auth", token)
        .expect(StatusCode.ok);
      expect(getResponse.name).equal("test");

      // update user
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

      // get all users
      const { body: getAllResponse } = await request
        .get(`/api/users`)
        .set("x-auth", token)
        .expect(200);

      const { items, count } = getAllResponse;

      const newUser = items.find((x: User) => x.name === getResponse.name);
      expect(newUser).not.undefined;
      expect(newUser.email).equal("test-user+updated@panenco.com");
      expect(count).equal(1);

      // delete newly created user
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
