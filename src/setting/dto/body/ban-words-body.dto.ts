import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsString } from 'class-validator';

export class BanWordsBodyDto {
  @ApiProperty()
  @IsBoolean()
  is_enabled: boolean;

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  dictionary: string[];
}
