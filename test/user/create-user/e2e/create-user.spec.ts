import { HttpStatus, INestApplication } from "@nestjs/common";
import faker from "faker";
import parallel from "mocha.parallel";
import request from "supertest";
import { Interface } from "@app/lib/typescript/interface";
import { PrismaService } from "@app/shared/application/prisma-service";
import { CreateUserControllerInput } from "@app/user/create-user/application/ports/create-user-controller-input";
import { TestApplication } from "@test/helpers/test-application";

type Body = Interface<CreateUserControllerInput>;

const makeBody = (body: Partial<Body> = {}): Body => {
  const password = faker.internet.password();
  return {
    email: faker.internet.email(),
    password,
    passwordConfirmation: password,
    ...body,
  };
};

const endpoint = "/api/v1/users";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const makeRequest = (app: INestApplication, body: Body) =>
  request(app.getHttpServer()).post(endpoint).set("accept", "application/json").send(body);

parallel("CreateUserController", () => {
  it(`POST ${endpoint} ${HttpStatus.CREATED} CREATED`, async () => {
    await new TestApplication().run(async (app) => {
      await makeRequest(app, makeBody()).expect(HttpStatus.CREATED);
    });
  });

  it(`POST ${endpoint} ${HttpStatus.BAD_REQUEST} BAD_REQUEST`, async () => {
    await new TestApplication().run(async (app) => {
      await makeRequest(
        app,
        makeBody({
          email: faker.internet.domainName(),
        }),
      ).expect(HttpStatus.BAD_REQUEST);
    });
  });

  it(`POST ${endpoint} ${HttpStatus.BAD_REQUEST} BAD_REQUEST if password != passwordConfirmation`, async () => {
    await new TestApplication().run(async (app) => {
      await makeRequest(
        app,
        makeBody({
          passwordConfirmation: faker.internet.password(),
        }),
      ).expect(HttpStatus.BAD_REQUEST);
    });
  });

  it(`POST ${endpoint} ${HttpStatus.UNPROCESSABLE_ENTITY} UNPROCESSABLE_ENTITY if email already is in use`, async () => {
    await new TestApplication().run(async (app) => {
      const body = makeBody();
      const prisma = app.get(PrismaService);
      const data = { ...body };
      delete (data as Partial<Body>).passwordConfirmation;
      await prisma.user.create({
        data: {
          id: faker.datatype.uuid(),
          ...data,
        },
      });

      await makeRequest(app, body).expect(HttpStatus.UNPROCESSABLE_ENTITY);
    });
  });
});
