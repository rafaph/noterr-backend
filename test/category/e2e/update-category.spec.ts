import { HttpStatus, INestApplication } from "@nestjs/common";
import faker from "faker";
import parallel from "mocha.parallel";
import request, { Test } from "supertest";
import { UserEntity } from "@app/auth/domain/entities/user-entity";
import { TokenSignerService } from "@app/auth/domain/services/token-signer-service";
import { UpdateCategoryControllerInput } from "@app/category/application/ports/update-category-controller-input";
import { CategoryEntity } from "@app/category/domain/entities/category-entity";
import { CategoryRepository } from "@app/category/domain/repositories/category-repository";
import { Interface } from "@app/lib/ts/interface";
import { UUID } from "@app/lib/uuid";
import { PrismaService } from "@app/shared/application/services/prisma-service";
import { makeTokenPayload } from "@test/auth/helpers/factories";
import { makeCategoryEntity } from "@test/category/helpers/factories";
import { TestApplication } from "@test/helpers/test-application";
import { makeDatabaseUser } from "@test/user/helpers/factories";

interface Dependencies {
  readonly user: UserEntity;
  readonly accessToken: string;
}

type Body = Partial<Interface<UpdateCategoryControllerInput>>;

interface RequestParams {
  app: INestApplication;
  body: Body;
  accessToken?: string;
  id: string;
}

const makeBody = (body: Body = {}): Body => ({
  title: faker.name.title(),
  ...body,
});

const endpoint = "/api/v1/categories/:id";

const makeRequest = (params: RequestParams): Test => {
  const putRequest = request(params.app.getHttpServer())
    .put(endpoint.replace(":id", params.id))
    .set("accept", "application/json");

  if (params.accessToken) {
    putRequest.set("authorization", `Bearer ${params.accessToken}`);
  }

  return putRequest.send(params.body);
};

const makeCategories = async (app: INestApplication, userId: UUID): Promise<CategoryEntity[]> => {
  const repository = app.get(CategoryRepository);
  const categories = [makeCategoryEntity({ userId }), makeCategoryEntity({ userId })];

  for (const category of categories) {
    await repository.create(category);
  }

  return categories;
};

const makeDependencies = async (app: INestApplication): Promise<Dependencies> => {
  const user = await makeDatabaseUser(app.get(PrismaService));
  const tokenPayload = makeTokenPayload({
    userId: user.id.toString(),
  });
  const accessToken = await app.get(TokenSignerService).sign(tokenPayload);

  return {
    user,
    accessToken,
  };
};

parallel("UpdateCategoryController", () => {
  it(`PUT ${endpoint} ${HttpStatus.UNAUTHORIZED} UNAUTHORIZED`, async () => {
    await new TestApplication().run(async (app) => {
      const body = makeBody();
      await makeRequest({ id: faker.datatype.uuid(), app, body }).expect(HttpStatus.UNAUTHORIZED);
    });
  });

  it(`PUT ${endpoint} ${HttpStatus.BAD_REQUEST} BAD_REQUEST`, async () => {
    await new TestApplication().run(async (app) => {
      const body = makeBody({
        title: "",
      });
      const { accessToken } = await makeDependencies(app);
      await makeRequest({
        id: faker.datatype.uuid(),
        app,
        body,
        accessToken,
      }).expect(HttpStatus.BAD_REQUEST);
    });
  });

  it(`PUT ${endpoint} ${HttpStatus.NOT_FOUND} NOT_FOUND`, async () => {
    await new TestApplication().run(async (app) => {
      const body = makeBody();
      const { accessToken } = await makeDependencies(app);

      await makeRequest({
        id: faker.datatype.uuid(),
        app,
        body,
        accessToken,
      }).expect(HttpStatus.NOT_FOUND);
    });
  });

  it(`PUT ${endpoint} ${HttpStatus.NOT_FOUND} NOT_FOUND if :id is not a uuid`, async () => {
    await new TestApplication().run(async (app) => {
      const body = makeBody();
      const { accessToken } = await makeDependencies(app);

      await makeRequest({
        id: faker.name.firstName(),
        app,
        body,
        accessToken,
      }).expect(HttpStatus.NOT_FOUND);
    });
  });

  it(`PUT ${endpoint} ${HttpStatus.UNPROCESSABLE_ENTITY} UNPROCESSABLE_ENTITY`, async () => {
    await new TestApplication().run(async (app) => {
      const { accessToken, user } = await makeDependencies(app);
      const categories = await makeCategories(app, user.id);
      const body = makeBody({
        title: categories[1].title,
      });

      await makeRequest({
        id: categories[0].id.toString(),
        app,
        body,
        accessToken,
      }).expect(HttpStatus.UNPROCESSABLE_ENTITY);
    });
  });

  it(`PUT ${endpoint} ${HttpStatus.NO_CONTENT} NO_CONTENT`, async () => {
    await new TestApplication().run(async (app) => {
      const { accessToken, user } = await makeDependencies(app);
      const categories = await makeCategories(app, user.id);
      const body = makeBody();

      await makeRequest({
        id: categories[0].id.toString(),
        app,
        body,
        accessToken,
      }).expect(HttpStatus.NO_CONTENT);
    });
  });
});
