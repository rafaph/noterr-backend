/* istanbul ignore file */
import { hash } from "argon2";
import { PasswordHasher } from "@app/common/domain/password-hasher";

export class Argon2PasswordHasher implements PasswordHasher {
  public hash(password: string): Promise<string> {
    return hash(password);
  }
}
