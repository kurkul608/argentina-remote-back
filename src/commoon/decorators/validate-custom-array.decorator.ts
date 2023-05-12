import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';

@ValidatorConstraint({ name: 'IsCustomArray', async: true })
@Injectable()
export class CustomObjectConstraint implements ValidatorConstraintInterface {
  async validate(
    value: unknown[],
    args: ValidationArguments,
  ): Promise<boolean> {
    const [exceptField = []] = args.constraints;
    console.log(exceptField);
    for (const key of value) {
      if (!exceptField.includes(key)) {
        return false;
      }
    }
    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} entered is not valid`;
  }
}

export function IsCustomArray(
  exceptField: unknown[] = [],
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [exceptField],
      validator: CustomObjectConstraint,
    });
  };
}
