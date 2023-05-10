import { IsBoolean, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CleanServiceMessageDto {
  @ApiProperty({
    example: {
      new_member: true,
      left_member: false,
      video_call_start: false,
      video_call_end: true,
      auto_delete_timer_changed: true,
      pinned_message: true,
    },
  })
  @IsObject()
  system_messages_notification: {
    new_member: boolean;
    left_member: boolean;
    video_call_start: boolean;
    video_call_end: boolean;
    auto_delete_timer_changed: boolean;
    pinned_message: boolean;
  };
}
