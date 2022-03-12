import { Injectable } from "@nestjs/common";
import { hash } from "argon2";
import { PasswordHasherService } from "@app/auth/domain/services/password-hasher-service";

@Injectable()
export class Argon2PasswordHasherService implements PasswordHasherService {
  public hash(password: string): Promise<string> {
    return hash(password);
  }
}
