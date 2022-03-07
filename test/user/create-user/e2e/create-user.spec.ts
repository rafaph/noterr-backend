import { HttpStatus } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import faker from "faker";
import parallel from "mocha.parallel";
import sinon from "sinon";
import request from "supertest";
import { AppModule } from "@app/app-module";
import { Interface } from "@app/lib/typescript/interface";
import { CreateUserControllerInput } from "@app/user/create-user/application/create-user-controller-input";
import { CreateUserRepository } from "@app/user/create-user/domain/create-user-repository";
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
  it("POST /api/v1/users - 201 CREATED", async () => {
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
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(CreateUserRepository)
      .useValue({
        create: sinon.stub().resolves(),
        exists: sinon.stub().resolves(true),
      })
      .compile();
    await new TestApplication(moduleFixture).run(async (app) => {
      await request(app.getHttpServer())
        .post("/api/v1/users")
        .set("accept", "application/json")
        .send(
          makeBody(),
        )
        .expect(HttpStatus.UNPROCESSABLE_ENTITY);
    });
  });
});
