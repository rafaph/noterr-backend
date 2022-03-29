import { NotFoundException, Param, ParseUUIDPipe } from "@nestjs/common";
import { DefaultError } from "@app/lib/error/default-error";

export const IdParam = (error?: DefaultError): ParameterDecorator =>
  Param("id", new ParseUUIDPipe({ exceptionFactory: (): Error => new NotFoundException(error) }));
