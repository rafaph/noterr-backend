import { registerDecorator, ValidationOptions, ValidationArguments } from "class-validator";

export function MatchWith(property: string, validationOptions?: ValidationOptions) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return (object: Object, propertyName: string): void => {
    registerDecorator({
      name: "matchWith",
      target: object.constructor,
      propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: unknown, args: ValidationArguments) {
          const [relatedPropertyName] = <string[]>args.constraints;
          const relatedValue = (args.object as Record<string, unknown>)[relatedPropertyName];
          return typeof value === "string" && typeof relatedValue === "string" && value === relatedValue;
        },
        defaultMessage(args: ValidationArguments): string {
          const [relatedPropertyName] = <string[]>args.constraints;
          return `${args.property} must match with ${relatedPropertyName}.`;
        },
      },
    });
  };
}
