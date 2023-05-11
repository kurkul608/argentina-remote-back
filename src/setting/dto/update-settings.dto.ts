import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CleanServiceMessageBodyDto } from 'src/setting/dto/body/clean-service-message-body.dto';
import { IsCustomObject } from 'src/commoon/decorators/validate-custom-object.decorator';

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
  @Type(() => CleanServiceMessageBodyDto)
  @IsCustomObject({
    new_member: true,
    video_call_end: false,
    video_call_start: false,
    pinned_message: false,
    auto_delete_timer_changed: false,
    left_member: false,
  })
  clear_system_messages?: CleanServiceMessageBodyDto;
}
