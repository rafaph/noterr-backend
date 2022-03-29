import { DefaultError } from "@app/lib/error/default-error";
import { Either } from "@app/lib/ts/either";

export abstract class TokenExtractorService {
  public abstract extract(headers: Record<string, string>): Either<DefaultError, string>;
}
