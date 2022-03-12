import { Injectable } from "@nestjs/common";
import { IsAuthenticatedRepository } from "@app/auth/domain/repositories/is-authenticated-repository";
import { TokenExtractorService } from "@app/auth/domain/services/token-extractor-service";
import { TokenVerifierService } from "@app/auth/domain/services/token-verifier-service";
import { Either, left, right } from "@app/lib/either";
import { DefaultError } from "@app/lib/error/default-error";
import { UUID } from "@app/lib/uuid";

@Injectable()
export class IsAuthenticatedUseCase {
  public constructor(
    private readonly tokenExtractor: TokenExtractorService,
    private readonly tokenVerifier: TokenVerifierService,
    private readonly repository: IsAuthenticatedRepository,
  ) {}

  public async execute(headers: Record<string, string>): Promise<Either<DefaultError, UUID>> {
    const resultExtractor = this.tokenExtractor.extract(headers);

    if (resultExtractor.isLeft()) {
      return left(resultExtractor.value);
    }

    const resultVerifier = await this.tokenVerifier.verify(resultExtractor.value);

    if (resultVerifier.isLeft()) {
      return left(resultVerifier.value);
    }

    const userId = new UUID(resultVerifier.value.userId);
    const resultRepository = await this.repository.exists(userId);

    if (!resultRepository) {
      return left({
        message: "Invalid User Id",
        code: "INVALID_USER_ID",
      });
    }

    return right(userId);
  }
}
