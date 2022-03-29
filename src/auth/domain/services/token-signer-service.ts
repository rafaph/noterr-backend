import { TokenPayload } from "@app/auth/domain/ports/token-payload";

export abstract class TokenSignerService {
  public abstract sign(payload: TokenPayload): Promise<string>;
}
