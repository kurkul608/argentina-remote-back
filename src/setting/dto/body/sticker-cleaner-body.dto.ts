import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

export class StickerCleanerBodyDto {
  @ApiProperty()
  @IsBoolean()
  remove_stickers: boolean;

  @ApiProperty()
  @IsBoolean()
  remove_gif: boolean;

  @ApiProperty()
  @IsBoolean()
  remove_emoji: boolean;
}
