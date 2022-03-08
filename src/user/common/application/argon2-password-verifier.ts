/* istanbul ignore file */
import { Injectable } from "@nestjs/common";
import { verify } from "argon2";
import { PasswordVerifier } from "@app/user/common/domain/password-verifier";

@Injectable()
export class Argon2PasswordVerifier implements PasswordVerifier {
  public verify(hash: string, value: string): Promise<boolean> {
    return verify(hash, value);
  }
}
