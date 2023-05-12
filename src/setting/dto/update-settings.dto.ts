import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import {
  CleanServiceMessageBodyDto,
  CleanServiceMessageDto,
} from 'src/setting/dto/body/clean-service-message-body.dto';
import { IsCustomObject } from 'src/commoon/decorators/validate-custom-object.decorator';
import { MessageType } from 'src/setting/settings.schema';

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
      clear_all: true,
      message_types: [
        'new_member',
        'left_member',
        'video_call_start',
        'video_call_end',
        'auto_delete_timer_changed',
        'pinned_message',
      ],
    },
    description: 'Should bot remove system notification',
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CleanServiceMessageDto)
  clear_system_messages?: {
    clear_all: boolean;
    message_types: MessageType[];
  };
}
