import { Interface } from "@app/lib/ts/interface";
import { UUID } from "@app/lib/uuid";

export abstract class BaseRepository<T> {
  public abstract create(item: T): Promise<void>;
  public abstract update(item: T): Promise<void>;
  public abstract delete(id: UUID): Promise<void>;
  public abstract find(item: Partial<Interface<T>>): Promise<T[]>;
  public abstract findOne(item: Partial<Interface<T>>): Promise<T | void>;
}
