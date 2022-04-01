import { HttpStatus, INestApplication } from "@nestjs/common";
import parallel from "mocha.parallel";
import request, { Test } from "supertest";
import { UserEntity } from "@app/auth/domain/entities/user-entity";
import { TokenSignerService } from "@app/auth/domain/services/token-signer-service";
import { ListCategoryControllerOutput } from "@app/category/application/ports/list-category-controller-output";
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
}

const endpoint = "/api/v1/categories";

const makeRequest = (params: RequestParams): Test => {
  const deleteRequest = request(params.app.getHttpServer()).get(endpoint).set("accept", "application/json");

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

parallel("ListCategoryController", () => {
  it(`GET ${endpoint} ${HttpStatus.UNAUTHORIZED} UNAUTHORIZED`, async () => {
    await new TestApplication().run(async (app) => {
      await makeRequest({ app }).expect(HttpStatus.UNAUTHORIZED);
    });
  });

  it(`GET ${endpoint} ${HttpStatus.OK} OK`, async () => {
    await new TestApplication().run(async (app) => {
      const { accessToken, user } = await makeDependencies(app);
      const categories = await makeCategories(app, user.id);
      const body = categories.map((category) => new ListCategoryControllerOutput(category));

      const response = await makeRequest({
        app,
        accessToken,
      }).expect(HttpStatus.OK);

      expect(response.body).to.be.deep.equals(body);
    });
  });
});
