import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class CleanMessageByChannelDto {
  @ApiProperty()
  @IsBoolean()
  isEnable: boolean;

  @ApiProperty()
  text: string;
}

export class CleanMessageByChannelBodyDto {
  clear_messages_by_channel: CleanMessageByChannelDto;
}
