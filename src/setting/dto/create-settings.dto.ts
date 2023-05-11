import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CleanServiceMessageBodyDto } from 'src/setting/dto/body/clean-service-message-body.dto';

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
}
