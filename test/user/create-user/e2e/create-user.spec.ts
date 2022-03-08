import { HttpStatus } from "@nestjs/common";
import faker from "faker";
import parallel from "mocha.parallel";
import request from "supertest";
import { Interface } from "@app/lib/typescript/interface";
import { PrismaService } from "@app/shared/application/prisma-service";
import { CreateUserControllerInput } from "@app/user/create-user/application/create-user-controller-input";
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

parallel("CreateUserController", () => {
  it("POST /api/v1/users 201 CREATED", async () => {
    await new TestApplication().run(async (app) => {
      await request(app.getHttpServer())
        .post("/api/v1/users")
        .set("accept", "application/json")
        .send(makeBody())
        .expect(HttpStatus.CREATED);
    });
  });

  it("POST /api/v1/users 400 BAD_REQUEST", async () => {
    await new TestApplication().run(async (app) => {
      await request(app.getHttpServer())
        .post("/api/v1/users")
        .set("accept", "application/json")
        .send(
          makeBody({
            email: faker.internet.domainName(),
          }),
        )
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  it("POST /api/v1/users 400 BAD_REQUEST if password != passwordConfirmation", async () => {
    await new TestApplication().run(async (app) => {
      await request(app.getHttpServer())
        .post("/api/v1/users")
        .set("accept", "application/json")
        .send(
          makeBody({
            passwordConfirmation: faker.internet.password(),
          }),
        )
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  it("POST /api/v1/users 422 UNPROCESSABLE_ENTITY if email already is in use", async () => {
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

      await request(app.getHttpServer())
        .post("/api/v1/users")
        .set("accept", "application/json")
        .send(body)
        .expect(HttpStatus.UNPROCESSABLE_ENTITY);
    });
  });
});
