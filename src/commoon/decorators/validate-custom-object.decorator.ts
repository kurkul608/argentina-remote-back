import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';

@ValidatorConstraint({ name: 'IsCustomObject', async: true })
@Injectable()
export class CustomObjectConstraint implements ValidatorConstraintInterface {
  async validate<T>(value: T, args: ValidationArguments): Promise<boolean> {
    const [exceptField] = args.constraints;
    if (!value) return false;
    if (!exceptField) return false;

    for (const key of Object.keys(value)) {
      if (!(key in exceptField)) {
        return false;
      }
    }
    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} entered is not valid`;
  }
}

export function IsCustomObject<T>(
  exceptField: T = null,
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
