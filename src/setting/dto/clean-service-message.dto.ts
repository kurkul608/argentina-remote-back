import { IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CleanServiceMessageDto {
  @ApiProperty({
    example: true,
    description:
      'Pass True if you want to clean notification message about new member in chat',
  })
  @IsBoolean()
  cleanNewMemberMessage: boolean;

  @ApiProperty({
    example: true,
    description:
      'Pass True if you want to clean notification message about left member in chat',
  })
  @IsBoolean()
  cleanLeftMemberMessage: boolean;

  @ApiProperty({
    example: true,
    description:
      'Pass True if you want to clean notification message about someone pinned message in chat',
  })
  @IsBoolean()
  cleanPinnedMessage: boolean;
}
