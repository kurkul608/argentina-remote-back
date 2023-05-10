import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsObject, IsOptional } from 'class-validator';

export class UpdateSettingsDto {
  @ApiProperty({
    example: false,
    description: 'Should boy remove another bots',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  remove_bots?: boolean;

  @ApiProperty({
    example: {
      new_member: true,
    },
    description: 'Should bot remove system notification',
    required: false,
  })
  @IsObject()
  @IsOptional()
  system_messages_notification?: {
    new_member: boolean;
    left_member: boolean;
    video_call_start: boolean;
    video_call_end: boolean;
    auto_delete_timer_changed: boolean;
    pinned_message: boolean;
  };
}
