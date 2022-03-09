import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { TokenService } from "@app/user/auth/login/domain/token-service";
import { UserEntity } from "@app/user/auth/login/domain/user-entity";

@Injectable()
export class JwtTokenService implements TokenService {
  public constructor(private readonly jwtService: JwtService) {}

  public sign(user: UserEntity): Promise<string> {
    return this.jwtService.signAsync({ userId: user.id.toString() });
  }
}
