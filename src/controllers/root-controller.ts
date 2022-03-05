import { provide } from "inversify-binding-decorators";
import { JsonController, Post } from "routing-controllers";
import { HiService } from "@app/hi-service";

@JsonController()
@provide(RootController)
export class RootController {
  public constructor(private readonly helloService: HiService) {}

  @Post()
  public handle(): { message: string } {
    return {
      message: this.helloService.execute(),
    };
  }
}
