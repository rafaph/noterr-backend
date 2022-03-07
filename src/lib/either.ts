/* istanbul ignore file */
export class Left<L, R> {
  public constructor(public readonly value: L) {}

  public isLeft(): this is Left<L, R> {
    return true;
  }

  public isRight(): this is Right<L, R> {
    return false;
  }
}

export class Right<L, R> {
  public constructor(public readonly value: R) {}

  public isLeft(): this is Left<L, R> {
    return false;
  }

  public isRight(): this is Right<L, R> {
    return true;
  }
}

export type Either<L, R> = Left<L, R> | Right<L, R>;

export const left = <L, R>(l: L): Either<L, R> => {
  return new Left<L, R>(l);
};

export const right = <L, R>(r: R): Either<L, R> => {
  return new Right<L, R>(r);
};
