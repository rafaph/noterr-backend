import { JwtService } from "@nestjs/jwt";
import faker from "faker";
import sinon from "sinon";
import { JwtTokenVerifierService } from "@app/auth/application/services/jwt-token-verifier-service";
import { makeTokenPayload } from "@test/auth/helpers/factories";

interface Sut {
  readonly jwtService: JwtService;
  readonly jwtTokenVerifier: JwtTokenVerifierService;
}

const makeSut = (): Sut => {
  const jwtService = new JwtService({
    secret: faker.internet.password(),
  });

  return {
    jwtService,
    jwtTokenVerifier: new JwtTokenVerifierService(jwtService),
  };
};

describe("JwtTokenVerifierService", () => {
  it("should return a tokenPayload", async () => {
    const { jwtService, jwtTokenVerifier } = makeSut();

    const payload = makeTokenPayload();
    sinon.stub(jwtService, "verifyAsync").resolves(payload);

    const result = await jwtTokenVerifier.verify(faker.datatype.uuid());

    expect(result.isRight()).to.be.true;
    expect(result.value).to.be.equals(payload);
  });

  it("should return a DefaultError if access token is invalid", async () => {
    const { jwtTokenVerifier } = makeSut();

    const result = await jwtTokenVerifier.verify(faker.datatype.uuid());

    expect(result.isLeft()).to.be.true;
    expect(result.value).to.have.keys(["message", "code"]);
  });
});
