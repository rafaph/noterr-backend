import { Injectable } from "@nestjs/common";
import { InvalidUserIdError } from "@app/auth/domain/errors";
import { IsAuthenticatedRepository } from "@app/auth/domain/repositories/is-authenticated-repository";
import { TokenExtractorService } from "@app/auth/domain/services/token-extractor-service";
import { TokenVerifierService } from "@app/auth/domain/services/token-verifier-service";
import { DefaultError } from "@app/lib/error/default-error";
import { Either, left, right } from "@app/lib/ts/either";
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
      return left(InvalidUserIdError);
    }

    return right(userId);
  }
}
