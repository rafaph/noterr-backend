import { Injectable } from "@nestjs/common";
import { InvalidTokenTypeError, MissingAuthorizationHeaderError } from "@app/auth/domain/errors";
import { TokenExtractorService } from "@app/auth/domain/services/token-extractor-service";
import { DefaultError } from "@app/lib/error/default-error";
import { Either, left, right } from "@app/lib/ts/either";

@Injectable()
export class FromHeaderTokenExtractorService implements TokenExtractorService {
  private readonly HEADER = "authorization";
  private readonly TOKEN_TYPE = "Bearer";

  public extract(headers: Record<string, string>): Either<DefaultError, string> {
    if (!headers[this.HEADER]) {
      return left(MissingAuthorizationHeaderError);
    }

    const header = headers[this.HEADER];

    if (!header.startsWith(`${this.TOKEN_TYPE}`)) {
      return left(InvalidTokenTypeError);
    }

    return right(header.slice(7));
  }
}
