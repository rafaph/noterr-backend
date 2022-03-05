import { ClassConstructor } from "class-transformer";
import { Container } from "inversify";
import { IocAdapter } from "routing-controllers";

class InversifyAdapter implements IocAdapter {
  public constructor(private readonly container: Container) {}

  public get<T>(someClass: ClassConstructor<T>): T {
    return this.container.resolve<T>(someClass);
  }
}

export const createInversifyAdapter = (container: Container): IocAdapter => new InversifyAdapter(container);
