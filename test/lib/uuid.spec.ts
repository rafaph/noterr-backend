import faker from "faker";
import { v1 } from "uuid";
import { UUID } from "@app/lib/uuid";

describe("UUID", () => {
  it("should throw if identifier is invalid", () => {
    expect(() => new UUID(faker.name.firstName())).to.throw();
  });

  it("should throw if identifier is not v4", () => {
    expect(() => new UUID(v1())).to.throw();
  });

  it("should compare two uuids", () => {
    const uuid1 = UUID.new();
    const uuid2 = new UUID(uuid1.toString());

    expect(uuid1.equals(uuid2)).to.be.true;
  });
});
