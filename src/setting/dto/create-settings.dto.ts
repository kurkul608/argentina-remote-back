import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CleanServiceMessageBodyDto } from 'src/setting/dto/body/clean-service-message-body.dto';
import { CleanMessageByChannelBodyDto } from 'src/setting/dto/body/clean-message-by-channel-body.dto';
import {
  IClearByChannelMessages,
  IMessageCharacterLimit,
} from 'src/setting/settings.schema';
import { MessageCharacterLimiterBodyDto } from 'src/setting/dto/body/message-character-limiter-body.dto';

export class CreateSettingsDto {
  @ApiProperty({
    example: false,
    description: 'Should boy remove another bots',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  remove_bots?: boolean;

  @ApiProperty({
    description: 'Should bot remove system notification',
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CleanServiceMessageBodyDto)
  clear_system_messages?: CleanServiceMessageBodyDto;

  @ApiProperty({
    description: 'Should bot remove messages',
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CleanMessageByChannelBodyDto)
  clear_messages_by_channel?: IClearByChannelMessages;

  @ApiProperty({})
  @ValidateNested()
  @Type(() => MessageCharacterLimiterBodyDto)
  message_character_limit?: IMessageCharacterLimit;
}
