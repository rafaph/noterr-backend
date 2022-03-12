import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { TokenSignerService } from "@app/auth/domain/services/token-signer-service";
import { TokenPayload } from "@app/auth/domain/token-payload";

@Injectable()
export class JwtTokenSignerService implements TokenSignerService {
  public constructor(private readonly jwtService: JwtService) {}

  public sign(payload: TokenPayload): Promise<string> {
    return this.jwtService.signAsync(payload);
  }
}
