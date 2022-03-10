import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserEntity } from "@app/user/common/domain/user-entity";
import { TokenService } from "@app/user/login/domain/token-service";

@Injectable()
export class JwtTokenService implements TokenService {
  public constructor(private readonly jwtService: JwtService) {}

  public sign(user: UserEntity): Promise<string> {
    return this.jwtService.signAsync({ userId: user.id.toString() });
  }
}
