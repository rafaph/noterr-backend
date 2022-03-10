import { HttpStatus, INestApplication } from "@nestjs/common";
import faker from "faker";
import parallel from "mocha.parallel";
import request from "supertest";
import { Interface } from "@app/lib/typescript/interface";
import { PrismaService } from "@app/shared/application/prisma-service";
import { PasswordHasher } from "@app/user/common/domain/password-hasher";
import { LoginControllerInput } from "@app/user/login/application/ports/login-controller-input";
import { TestApplication } from "@test/helpers/test-application";

type Body = Interface<LoginControllerInput>;

const makeBody = (body: Partial<Body> = {}): Body => ({
  email: faker.internet.email(),
  password: faker.internet.password(),
  ...body,
});

const endpoint = "/api/v1/auth/login";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const makeRequest = (app: INestApplication, body: Body) =>
  request(app.getHttpServer()).post(endpoint).set("accept", "application/json").send(body);

parallel("LoginController", () => {
  it(`POST ${endpoint} ${HttpStatus.OK} OK`, async () => {
    await new TestApplication().run(async (app) => {
      const prisma = app.get(PrismaService);
      const passwordHasher = app.get(PasswordHasher);
      const body = makeBody();
      await prisma.user.create({
        data: {
          id: faker.datatype.uuid(),
          password: await passwordHasher.hash(body.password),
          email: body.email,
        },
      });

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
      const passwordHasher = app.get(PasswordHasher);
      const body = makeBody();
      await prisma.user.create({
        data: {
          id: faker.datatype.uuid(),
          password: await passwordHasher.hash(faker.internet.password()),
          email: body.email,
        },
      });

      await makeRequest(app, body).expect(HttpStatus.UNAUTHORIZED);
    });
  });
});
