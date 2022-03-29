import { HttpStatus, INestApplication } from "@nestjs/common";
import faker from "faker";
import parallel from "mocha.parallel";
import request, { Test } from "supertest";
import { LoginControllerInput } from "@app/auth/application/ports/login-controller-input";
import { Interface } from "@app/lib/ts/interface";
import { PrismaService } from "@app/shared/application/services/prisma-service";
import { TestApplication } from "@test/helpers/test-application";
import { makeDatabaseUser } from "@test/user/helpers/factories";

type Body = Interface<LoginControllerInput>;

const makeBody = (body: Partial<Body> = {}): Body => ({
  email: faker.internet.email(),
  password: faker.internet.password(),
  ...body,
});

const endpoint = "/api/v1/auth/login";

const makeRequest = (app: INestApplication, body: Body): Test =>
  request(app.getHttpServer()).post(endpoint).set("accept", "application/json").send(body);

parallel("LoginController", () => {
  it(`POST ${endpoint} ${HttpStatus.OK} OK`, async () => {
    await new TestApplication().run(async (app) => {
      const prisma = app.get(PrismaService);
      const { email, password } = await makeDatabaseUser(prisma);
      const body = makeBody({ email, password });

      const response = await makeRequest(app, body).expect(HttpStatus.OK);

      expect(response.body).to.have.key("accessToken");
    });
  });

  it(`POST ${endpoint} ${HttpStatus.UNAUTHORIZED} UNAUTHORIZED if user does not exists`, async () => {
    await new TestApplication().run(async (app) => {
      const body = makeBody();

      await makeRequest(app, body).expect(HttpStatus.UNAUTHORIZED);
    });
  });

  it(`POST ${endpoint} ${HttpStatus.UNAUTHORIZED} UNAUTHORIZED if user password is wrong`, async () => {
    await new TestApplication().run(async (app) => {
      const prisma = app.get(PrismaService);
      const { email } = await makeDatabaseUser(prisma);
      const body = makeBody({ email });

      await makeRequest(app, body).expect(HttpStatus.UNAUTHORIZED);
    });
  });
});
