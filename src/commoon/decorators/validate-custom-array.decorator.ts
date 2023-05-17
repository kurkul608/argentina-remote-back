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
  async validate<T>(value: T[], args: ValidationArguments): Promise<boolean> {
    const [exceptField = []] = args.constraints;

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

export function IsCustomArray<T>(
  exceptField: T[] = [],
  validationOptions?: ValidationOptions,
) {
  return function <T>(object: T, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [exceptField],
      validator: CustomObjectConstraint,
    });
  };
}
