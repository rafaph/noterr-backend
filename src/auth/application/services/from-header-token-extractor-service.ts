import { Injectable } from "@nestjs/common";
import { TokenExtractorService } from "@app/auth/domain/services/token-extractor-service";
import { Either, left, right } from "@app/lib/either";
import { DefaultError } from "@app/lib/error/default-error";

@Injectable()
export class FromHeaderTokenExtractorService implements TokenExtractorService {
  private readonly HEADER = "authorization";

  public extract(headers: Record<string, string>): Either<DefaultError, string> {
    if (!headers[this.HEADER]) {
      return left({
        message: "Missing authorization header",
        code: "MISSING_AUTHORIZATION_HEADER",
      });
    }

    const header = headers[this.HEADER];

    if (!header.startsWith("Bearer ")) {
      return left({
        message: "Invalid token type",
        code: "INVALID_TOKEN_TYPE",
      });
    }

    return right(header.slice(7));
  }
}
