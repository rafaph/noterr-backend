import { TokenPayload } from "@app/auth/domain/ports/token-payload";
import { DefaultError } from "@app/lib/error/default-error";
import { Either } from "@app/lib/ts/either";

export abstract class TokenVerifierService {
  public abstract verify(accessToken: string): Promise<Either<DefaultError, TokenPayload>>;
}
