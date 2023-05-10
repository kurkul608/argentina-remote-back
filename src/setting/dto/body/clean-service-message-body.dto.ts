import { IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CleanServiceMessage {
  @ApiProperty()
  @IsBoolean()
  new_member: boolean;
  @ApiProperty()
  @IsBoolean()
  left_member: boolean;
  @ApiProperty()
  @IsBoolean()
  video_call_start: boolean;
  @ApiProperty()
  @IsBoolean()
  video_call_end: boolean;
  @ApiProperty()
  @IsBoolean()
  auto_delete_timer_changed: boolean;
  @ApiProperty()
  @IsBoolean()
  pinned_message: boolean;
}

export class CleanServiceMessageBodyDto {
  clear_system_messages: CleanServiceMessage;
}
