/* istanbul ignore file */
import { verify } from "argon2";
import { PasswordVerifier } from "@app/common/domain/password-verifier";

export class Argon2PasswordVerifier implements PasswordVerifier {
  public verify(hash: string, value: string): Promise<boolean> {
    return verify(hash, value);
  }
}
