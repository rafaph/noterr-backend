import { UUID } from "@app/lib/uuid";

export interface UserData {
  id: UUID;
  email: string;
  password: string;
}
