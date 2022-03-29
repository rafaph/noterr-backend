import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { IS_PUBLIC_KEY } from "@app/auth/application/decorators/public-decorator";
import { UnauthorizedError } from "@app/auth/domain/errors";
import { IsAuthenticatedUseCase } from "@app/auth/domain/use-cases/is-authenticated-use-case";

@Injectable()
export class AuthGuard implements CanActivate {
  public constructor(private readonly useCase: IsAuthenticatedUseCase, private readonly reflector: Reflector) {}

  private isPublic(context: ExecutionContext): boolean {
    return this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()]);
  }

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    if (this.isPublic(context)) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const result = await this.useCase.execute(request.headers as Record<string, string>);

    if (result.isLeft()) {
      throw new UnauthorizedException(UnauthorizedError);
    }

    request.userId = result.value;

    return true;
  }
}
