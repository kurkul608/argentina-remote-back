import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CleanServiceMessage } from 'src/setting/dto/body/clean-service-message-body.dto';
import { Unique } from 'src/setting/helpers/validate-object-filed-decorator.helper';

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
      video_call_end: false,
      video_call_start: false,
      pinned_message: false,
      auto_delete_timer_changed: false,
      left_member: false,
    },
    description: 'Should bot remove system notification',
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CleanServiceMessage)
  @Unique({
    new_member: true,
    video_call_end: false,
    video_call_start: false,
    pinned_message: false,
    auto_delete_timer_changed: false,
    left_member: false,
  })
  clear_system_messages?: CleanServiceMessage;
}
