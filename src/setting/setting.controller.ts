import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UsePipes,
} from '@nestjs/common';
import { SettingService } from './setting.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MongoIdPipe } from '../pipes/mongo-id.pipe';
import { SetAdminPermissionsBodyDto } from 'src/setting/dto/body/set-admin-permissions-body.dto';
import { SetRestrictPermissionsBodyDto } from 'src/setting/dto/body/set-restrict-permissions-body.dto';
import { Settings } from 'src/setting/settings.schema';
import { UpdateSettingsDto } from 'src/setting/dto/update-settings.dto';

@Controller('setting')
@ApiTags('setting')
export class SettingController {
  constructor(private readonly settingService: SettingService) {}

  @ApiResponse({ status: 200, type: Object })
  @ApiOperation({ summary: 'Return chat Admins' })
  @UsePipes(MongoIdPipe)
  @Get(':id/admin')
  async getAdmins(@Param('id') id: string) {
    return this.settingService.getChatAdmins(id);
  }

  @ApiResponse({ status: 201, type: Object })
  @ApiOperation({ summary: 'Promote user to Admin' })
  @UsePipes(MongoIdPipe)
  @Post(':chatId/admin/promote/:id')
  async promoteToAdmin(
    @Param('chatId') chatId: string,
    @Query('id') id: number,
    @Body() dto: SetAdminPermissionsBodyDto,
  ) {
    return this.settingService.promoteUser(dto, chatId, id);
  }

  @ApiResponse({ status: 201, type: Object })
  @ApiOperation({ summary: 'Restrict Admin to user' })
  @UsePipes(MongoIdPipe)
  @Post(':chatId/admin/restrict/:id')
  async restrictAdmin(
    @Param('chatId') chatId: string,
    @Query('id') id: number,
    @Body() dto: SetRestrictPermissionsBodyDto,
  ) {
    return await this.settingService.restrictAdmin(dto, chatId, id);
  }

  @ApiResponse({ status: 201, type: Settings })
  @ApiOperation({ summary: 'Update settings method' })
  @UsePipes(MongoIdPipe)
  @Patch(':settingsId')
  async updateSettings(
    @Param('settingsId') settingsId: string,
    @Req() req,
    @Body() dto: UpdateSettingsDto,
  ) {
    const bearer = req.headers.authorization;
    const token = bearer.split('Bearer ')[1];
    return await this.settingService.updateSettings(settingsId, dto, token);
  }
}
