import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { TokenVerifierService } from "@app/auth/domain/services/token-verifier-service";
import { TokenPayload } from "@app/auth/domain/token-payload";
import { Either, left, right } from "@app/lib/either";
import { DefaultError } from "@app/lib/error/default-error";

@Injectable()
export class JwtTokenVerifierService implements TokenVerifierService {
  public constructor(private readonly jwtService: JwtService) {}

  public async verify(accessToken: string): Promise<Either<DefaultError, TokenPayload>> {
    try {
      const payload = await this.jwtService.verifyAsync<TokenPayload>(accessToken);
      return right(payload);
    } catch {
      return left({
        message: "Invalid token",
        code: "INVALID_TOKEN",
      });
    }
  }
}
