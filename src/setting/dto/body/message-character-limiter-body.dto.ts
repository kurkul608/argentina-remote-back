import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class MessageCharacterLimiterBodyDto {
  @ApiProperty()
  @IsBoolean()
  is_enable: boolean;

  @ApiProperty()
  @IsNumber()
  character_limit: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  message?: boolean;
}
