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
  async validate(value: any, args: ValidationArguments): Promise<boolean> {
    const [exceptField = null] = args.constraints;
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

export function IsCustomObject(
  exceptField: Record<string, unknown> = null,
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
