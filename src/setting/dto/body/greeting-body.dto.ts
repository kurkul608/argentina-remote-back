import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

export class GreetingBodyDto {
  @ApiProperty()
  @IsBoolean()
  is_enable: boolean;

  @ApiProperty()
  @IsArray()
  @IsOptional()
  previous_greetings?: number[];

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  clear_last_message?: boolean;

  @ApiProperty()
  @IsString()
  @IsOptional()
  message?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  clear_time?: string;
}
