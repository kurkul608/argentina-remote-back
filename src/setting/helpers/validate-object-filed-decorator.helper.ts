import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Settings, SettingsDocument } from 'src/setting/settings.schema';
import { Model } from 'mongoose';

@ValidatorConstraint({ name: 'Unique', async: true })
@Injectable()
export class UniqueConstraint implements ValidatorConstraintInterface {
  constructor(
    @InjectModel(Settings.name)
    private readonly settingsModel: Model<SettingsDocument>,
  ) {}

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

export function Unique(
  exceptField: Record<string, unknown> = null,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [exceptField],
      validator: UniqueConstraint,
    });
  };
}
