import { TokenPayload } from "@app/auth/domain/token-payload";
import { Either } from "@app/lib/either";
import { DefaultError } from "@app/lib/error/default-error";

export abstract class TokenVerifierService {
  public abstract verify(accessToken: string): Promise<Either<DefaultError, TokenPayload>>;
}
