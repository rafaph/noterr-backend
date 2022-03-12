import { Either } from "@app/lib/either";
import { DefaultError } from "@app/lib/error/default-error";

export abstract class TokenExtractorService {
  public abstract extract(headers: Record<string, string>): Either<DefaultError, string>;
}
