import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InvalidTokenError } from "@app/auth/domain/errors";
import { TokenPayload } from "@app/auth/domain/ports/token-payload";
import { TokenVerifierService } from "@app/auth/domain/services/token-verifier-service";
import { DefaultError } from "@app/lib/error/default-error";
import { Either, left, right } from "@app/lib/ts/either";

@Injectable()
export class JwtTokenVerifierService implements TokenVerifierService {
  public constructor(private readonly jwtService: JwtService) {}

  public async verify(accessToken: string): Promise<Either<DefaultError, TokenPayload>> {
    try {
      const payload = await this.jwtService.verifyAsync<TokenPayload>(accessToken);
      return right(payload);
    } catch {
      return left(InvalidTokenError);
    }
  }
}
