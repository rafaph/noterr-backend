import { provide } from "inversify-binding-decorators";
import { HiService } from "@app/hi-service";

@provide(HiService)
export class HelloService implements HiService {
  public execute(): string {
    return "Hello Service";
  }
}
