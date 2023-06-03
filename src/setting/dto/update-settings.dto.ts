import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CleanServiceMessageDto } from 'src/setting/dto/body/clean-service-message-body.dto';
import { ServiceMessageType } from 'src/setting/interfaces/service-message.interface';
import { serviceMessages } from 'src/setting/constants/sevice-message.constants';
import { GreetingBodyDto } from 'src/setting/dto/body/greeting-body.dto';
import { IGreeting, IStickerCleaner } from 'src/setting/settings.schema';
import { CleanMessageByChannelDto } from 'src/setting/dto/body/clean-message-by-channel-body.dto';
import { StickerCleanerBodyDto } from 'src/setting/dto/body/sticker-cleaner-body.dto';

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
      message_types: serviceMessages,
    },
    description: 'Should bot remove system notification',
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CleanServiceMessageDto)
  clear_system_messages?: {
    clear_all: boolean;
    message_types: ServiceMessageType[];
  };

  @ApiProperty({
    example: {
      isEnable: true,
      text: 'Тебе нельзятакое постить',
    },
    description: 'Should bot remove messages',
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CleanMessageByChannelDto)
  clear_messages_by_channel?: CleanMessageByChannelDto;

  @ApiProperty({
    example: {
      is_enable: true,
      previous_greetings: [],
      clear_last_message: true,
      message: 'Welcome to the club',
      clear_time: '2023-10-10',
    },
    description: 'setting for greeting message',
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => GreetingBodyDto)
  greeting?: IGreeting;

  @ApiProperty({
    example: {
      remove_stickers: false,
      remove_emoji: false,
      remove_gif: false,
    },
    description: 'Sticker cleaner config',
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => StickerCleanerBodyDto)
  sticker_cleaner?: IStickerCleaner;
}
