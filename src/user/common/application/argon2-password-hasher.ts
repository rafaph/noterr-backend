import { Injectable } from "@nestjs/common";
import { hash } from "argon2";
import { PasswordHasher } from "@app/user/common/domain/password-hasher";

@Injectable()
export class Argon2PasswordHasher implements PasswordHasher {
  public hash(password: string): Promise<string> {
    return hash(password);
  }
}
