import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { IsAuthenticatedUseCase } from "@app/auth/domain/use-cases/is-authenticated-use-case";

@Injectable()
export class AuthGuard implements CanActivate {
  public constructor(private readonly useCase: IsAuthenticatedUseCase) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const result = await this.useCase.execute(request.headers as Record<string, string>);

    if (result.isLeft()) {
      throw new UnauthorizedException({
        message: "Unauthorized",
        code: "UNAUTHORIZED",
      });
    }

    request.userId = result.value;

    return true;
  }
}
