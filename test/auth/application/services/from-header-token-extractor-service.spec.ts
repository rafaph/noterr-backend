import faker from "faker";
import { FromHeaderTokenExtractorService } from "@app/auth/application/services/from-header-token-extractor-service";

interface Sut {
  readonly tokenExtractor: FromHeaderTokenExtractorService;
}

const makeSut = (): Sut => ({
  tokenExtractor: new FromHeaderTokenExtractorService(),
});

const HEADER = "authorization";

describe("FromHeaderTokenExtractorService", () => {
  it("should return a DefaultError if authorization header is missing", () => {
    const { tokenExtractor } = makeSut();
    const result = tokenExtractor.extract({});

    expect(result.isLeft()).to.be.true;
    expect(result.value).to.have.keys(["message", "code"]);
  });

  it("should return a DefaultError if token type is invalid", () => {
    const { tokenExtractor } = makeSut();
    const result = tokenExtractor.extract({
      [HEADER]: faker.datatype.uuid(),
    });

    expect(result.isLeft()).to.be.true;
    expect(result.value).to.have.keys(["message", "code"]);
  });

  it("should return the extracted access token", () => {
    const { tokenExtractor } = makeSut();
    const accessToken = faker.datatype.uuid();
    const result = tokenExtractor.extract({
      [HEADER]: `Bearer ${accessToken}`,
    });

    expect(result.isRight()).to.be.true;
    expect(result.value).to.be.equals(accessToken);
  });
});
