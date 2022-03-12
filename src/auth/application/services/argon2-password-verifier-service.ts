import { Injectable } from "@nestjs/common";
import { verify } from "argon2";
import { PasswordVerifierService } from "@app/auth/domain/services/password-verifier-service";

@Injectable()
export class Argon2PasswordVerifierService implements PasswordVerifierService {
  public verify(hash: string, value: string): Promise<boolean> {
    return verify(hash, value);
  }
}
