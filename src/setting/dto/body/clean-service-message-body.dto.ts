import { IsArray, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MessageType } from 'src/setting/settings.schema';
import { IsCustomArray } from 'src/commoon/decorators/validate-custom-array.decorator';

export class CleanServiceMessageDto {
  @ApiProperty()
  @IsBoolean()
  clear_all: boolean;

  @ApiProperty()
  @IsCustomArray([
    'new_member',
    'left_member',
    'video_call_start',
    'video_call_end',
    'auto_delete_timer_changed',
    'pinned_message',
  ])
  @IsArray()
  message_types: MessageType[];
}

export class CleanServiceMessageBodyDto {
  clear_system_messages: CleanServiceMessageDto;
}
