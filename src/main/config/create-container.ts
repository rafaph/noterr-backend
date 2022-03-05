import { Container } from "inversify";
import { buildProviderModule } from "inversify-binding-decorators";
import "@app/services/hello-service";

let container: Container;

export const createContainer = (): Container => {
  if (!container) {
    container = new Container();
    container.load(buildProviderModule());
  }

  return container;
};
