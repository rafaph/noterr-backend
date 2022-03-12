import { TokenPayload } from "@app/auth/domain/token-payload";

export abstract class TokenSignerService {
  public abstract sign(payload: TokenPayload): Promise<string>;
}
