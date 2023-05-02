import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { toBoolean, toNumber } from '../../../commoon/helpers/query.helper';

export class GetChatsQueryDto {
  @ApiProperty({
    example: 5,
    description: 'limit',
    required: true,
  })
  @Transform(({ value }) => toNumber(value, { default: 5, min: 1, max: 15 }))
  @IsNumber()
  readonly limit: number;

  @ApiProperty({
    example: 0,
    description: 'offset',
    required: true,
  })
  @Transform(({ value }) => toNumber(value, { default: 0, min: 0 }))
  @IsNumber()
  readonly offset: number;

  @ApiProperty({
    example: true,
    description: 'hidden chat or not',
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => toBoolean(value))
  @IsBoolean()
  readonly isHidden: boolean;

  @ApiProperty({
    example: 'Chat name',
    description: 'search by title',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly q: string;
}
