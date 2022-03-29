import { HttpStatus, INestApplication } from "@nestjs/common";
import faker from "faker";
import parallel from "mocha.parallel";
import request, { Test } from "supertest";
import { UserEntity } from "@app/auth/domain/entities/user-entity";
import { TokenSignerService } from "@app/auth/domain/services/token-signer-service";
import { CategoryEntity } from "@app/category/domain/entities/category-entity";
import { CategoryRepository } from "@app/category/domain/repositories/category-repository";
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

interface RequestParams {
  app: INestApplication;
  accessToken?: string;
  id: string;
}

const endpoint = "/api/v1/categories/:id";

const makeRequest = (params: RequestParams): Test => {
  const deleteRequest = request(params.app.getHttpServer())
    .delete(endpoint.replace(":id", params.id))
    .set("accept", "application/json");

  if (params.accessToken) {
    deleteRequest.set("authorization", `Bearer ${params.accessToken}`);
  }

  return deleteRequest.send();
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

parallel("DeleteCategoryController", () => {
  it(`DELETE ${endpoint} ${HttpStatus.UNAUTHORIZED} UNAUTHORIZED`, async () => {
    await new TestApplication().run(async (app) => {
      await makeRequest({ id: faker.datatype.uuid(), app }).expect(HttpStatus.UNAUTHORIZED);
    });
  });

  it(`DELETE ${endpoint} ${HttpStatus.NOT_FOUND} NOT_FOUND`, async () => {
    await new TestApplication().run(async (app) => {
      const { accessToken } = await makeDependencies(app);

      await makeRequest({
        id: faker.datatype.uuid(),
        app,
        accessToken,
      }).expect(HttpStatus.NOT_FOUND);
    });
  });

  it(`DELETE ${endpoint} ${HttpStatus.NOT_FOUND} NOT_FOUND if :id is not a uuid`, async () => {
    await new TestApplication().run(async (app) => {
      const { accessToken } = await makeDependencies(app);

      await makeRequest({
        id: faker.name.firstName(),
        app,
        accessToken,
      }).expect(HttpStatus.NOT_FOUND);
    });
  });

  it(`DELETE ${endpoint} ${HttpStatus.NO_CONTENT} NO_CONTENT`, async () => {
    await new TestApplication().run(async (app) => {
      const { accessToken, user } = await makeDependencies(app);
      const categories = await makeCategories(app, user.id);

      await makeRequest({
        id: categories[0].id.toString(),
        app,
        accessToken,
      }).expect(HttpStatus.NO_CONTENT);
    });
  });
});
