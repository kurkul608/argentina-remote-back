import { IsArray, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsCustomArray } from 'src/commoon/decorators/validate-custom-array.decorator';
import { ServiceMessageType } from 'src/setting/interfaces/service-message.interface';

const serviceMessages: ServiceMessageType[] = [
  'new_member',
  'left_member',
  'video_call_start',
  'video_call_end',
  'auto_delete_timer_changed',
  'pinned_message',
  'new_chat_photo',
  'new_chat_title',
];

export class CleanServiceMessageDto {
  @ApiProperty()
  @IsBoolean()
  clear_all: boolean;

  @ApiProperty()
  @IsCustomArray(serviceMessages)
  @IsArray()
  message_types: ServiceMessageType[];
}

export class CleanServiceMessageBodyDto {
  clear_system_messages: CleanServiceMessageDto;
}
