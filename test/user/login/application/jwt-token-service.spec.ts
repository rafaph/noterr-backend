import { JwtService } from "@nestjs/jwt";
import faker from "faker";
import sinon from "sinon";
import { JwtTokenService } from "@app/user/login/application/jwt-token-service";
import { makeUserEntity } from "@test/user/common/helpers/factories";

interface Sut {
  readonly jwtService: JwtService;
  readonly tokenService: JwtTokenService;
}

const makeSut = (): Sut => {
  const jwtService = new JwtService({
    secret: faker.internet.password(),
  });
  const tokenService = new JwtTokenService(jwtService);

  return { jwtService, tokenService };
};

describe("JwtTokenService", () => {
  it("should call signAsync from JwtService", async () => {
    const { jwtService, tokenService } = makeSut();
    const signAsyncSpy = sinon.spy(jwtService, "signAsync");

    const userEntity = makeUserEntity();
    await tokenService.sign(userEntity);

    expect(signAsyncSpy).to.have.been.calledOnceWithExactly({
      userId: userEntity.id.toString(),
    });
  });

  it("should throw if jwtService throws", async () => {
    const { jwtService, tokenService } = makeSut();

    sinon.stub(jwtService, "signAsync").rejects();

    await expect(tokenService.sign(makeUserEntity())).to.eventually.be.rejected;
  });
});
