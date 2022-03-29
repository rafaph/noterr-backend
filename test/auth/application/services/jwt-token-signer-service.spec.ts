import faker from "@faker-js/faker";
import { JwtService } from "@nestjs/jwt";
import sinon from "sinon";
import { JwtTokenSignerService } from "@app/auth/application/services/jwt-token-signer-service";
import { makeTokenPayload } from "@test/auth/helpers/factories";

interface Sut {
  readonly jwtService: JwtService;
  readonly jwtTokenSigner: JwtTokenSignerService;
}

const makeSut = (): Sut => {
  const jwtService = new JwtService({
    secret: faker.internet.password(),
  });

  return {
    jwtService,
    jwtTokenSigner: new JwtTokenSignerService(jwtService),
  };
};

describe("JwtTokenSignerService", () => {
  it("should call signAsync from JwtService", async () => {
    const { jwtService, jwtTokenSigner } = makeSut();
    const signAsyncSpy = sinon.spy(jwtService, "signAsync");

    const payload = makeTokenPayload();
    await jwtTokenSigner.sign(payload);

    expect(signAsyncSpy).to.have.been.calledOnceWithExactly(payload);
  });

  it("should throw if JwtService throws", async () => {
    const { jwtService, jwtTokenSigner } = makeSut();

    sinon.stub(jwtService, "signAsync").rejects();

    await expect(jwtTokenSigner.sign(makeTokenPayload())).to.eventually.be.rejected;
  });
});
