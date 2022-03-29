import faker from "@faker-js/faker";
import { HttpStatus, INestApplication } from "@nestjs/common";
import parallel from "mocha.parallel";
import request, { Test } from "supertest";
import { UserEntity } from "@app/auth/domain/entities/user-entity";
import { TokenSignerService } from "@app/auth/domain/services/token-signer-service";
import { CreateCategoryControllerInput } from "@app/category/application/ports/create-category-controller-input";
import { CategoryRepository } from "@app/category/domain/repositories/category-repository";
import { Interface } from "@app/lib/ts/interface";
import { UUID } from "@app/lib/uuid";
import { PrismaService } from "@app/shared/application/services/prisma-service";
import { makeTokenPayload } from "@test/auth/helpers/factories";
import { TestApplication } from "@test/helpers/test-application";
import { makeDatabaseUser } from "@test/user/helpers/factories";

type Body = Partial<Interface<CreateCategoryControllerInput>>;

interface Dependencies {
  readonly user: UserEntity;
  readonly accessToken: string;
}

const endpoint = "/api/v1/categories";

const makeBody = (body: Partial<Body> = {}): Body => ({
  title: faker.name.title(),
  ...body,
});

const makeRequest = (app: INestApplication, body: Body, accessToken?: string): Test => {
  const postRequest = request(app.getHttpServer()).post(endpoint).set("accept", "application/json");

  if (accessToken) {
    postRequest.set("authorization", `Bearer ${accessToken}`);
  }

  return postRequest.send(body);
};

const makeDependencies = async (app: INestApplication): Promise<Dependencies> => {
  const user = await makeDatabaseUser(app.get(PrismaService));
  const tokenPayload = makeTokenPayload({ userId: user.id.toString() });
  const accessToken = await app.get(TokenSignerService).sign(tokenPayload);

  return { user, accessToken };
};

parallel("CreateCategoryController", () => {
  it(`POST ${endpoint} ${HttpStatus.UNAUTHORIZED} UNAUTHORIZED`, async () => {
    await new TestApplication().run(async (app) => {
      const body = makeBody();
      await makeRequest(app, body).expect(HttpStatus.UNAUTHORIZED);
    });
  });

  it(`POST ${endpoint} ${HttpStatus.BAD_REQUEST} BAD_REQUEST`, async () => {
    await new TestApplication().run(async (app) => {
      const { accessToken } = await makeDependencies(app);
      await makeRequest(app, {}, accessToken).expect(HttpStatus.BAD_REQUEST);
    });
  });

  it(`POST ${endpoint} ${HttpStatus.UNPROCESSABLE_ENTITY} UNPROCESSABLE_ENTITY`, async () => {
    await new TestApplication().run(async (app) => {
      const { accessToken, user } = await makeDependencies(app);
      const repository = app.get(CategoryRepository);
      const body = makeBody();

      await repository.create({
        id: UUID.new(),
        userId: user.id,
        title: <string>body.title,
      });

      await makeRequest(app, body, accessToken).expect(HttpStatus.UNPROCESSABLE_ENTITY);
    });
  });

  it(`POST ${endpoint} ${HttpStatus.CREATED} CREATED`, async () => {
    await new TestApplication().run(async (app) => {
      const { accessToken } = await makeDependencies(app);
      const body = makeBody();

      const response = await makeRequest(app, body, accessToken).expect(HttpStatus.CREATED);

      expect(response.body).to.have.keys(["id"]);
    });
  });
});
