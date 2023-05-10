import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { BotService } from '../bot/bot.service';
import { SetAdminPermissionsBodyDto } from 'src/setting/dto/body/set-admin-permissions-body.dto';
import { SetRestrictPermissionsBodyDto } from 'src/setting/dto/body/set-restrict-permissions-body.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Settings, SettingsDocument } from 'src/setting/settings.schema';
import { Model } from 'mongoose';
import { CreateSettingsDto } from 'src/setting/dto/create-settings.dto';
import { ChatsService } from 'src/chats/chats.service';
import { AuthService } from 'src/auth/auth.service';
import { UpdateSettingsDto } from 'src/setting/dto/update-settings.dto';
import { CleanServiceMessageBodyDto } from 'src/setting/dto/body/clean-service-message-body.dto';

@Injectable()
export class SettingService {
  constructor(
    @InjectModel(Settings.name)
    private readonly settingsModel: Model<SettingsDocument>,
    @Inject(forwardRef(() => BotService))
    private readonly botService: BotService,
    @Inject(forwardRef(() => ChatsService))
    private readonly chatsService: ChatsService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  async createSettings(
    chatId: string,
    dto: CreateSettingsDto,
    ownerId: string,
  ) {
    const chat = await this.chatsService.getChat(chatId);

    if (String(chat.owner) !== String(ownerId)) {
      throw new HttpException(
        'You are not the chat owner',
        HttpStatus.FORBIDDEN,
      );
    }

    const oldSettings = await this.settingsModel.findOne({ chat: chat._id });

    if (oldSettings?._id) {
      throw new HttpException(
        'The settings for this chat have already been created',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.settingsModel.create({
      ...dto,
      remove_bots: false,
      clear_system_messages: {
        new_member: true,
        video_call_end: true,
        video_call_start: true,
        pinned_message: true,
        auto_delete_timer_changed: true,
        left_member: true,
      },
      chat: chat._id,
    });
  }

  async updateSettings(
    settingsId: string,
    dto: UpdateSettingsDto,
    token: string,
  ) {
    const { _id } = await this.authService.getUserInfo(token);
    const settings = await this.settingsModel.findById(settingsId);

    if (!settings) {
      throw new HttpException(
        'Document (Settings) not found',
        HttpStatus.NOT_FOUND,
      );
    }

    const chat = await this.chatsService.getChat(String(settings.chat));

    if (String(chat.owner) !== String(_id)) {
      throw new HttpException(
        'You are not the chat owner',
        HttpStatus.FORBIDDEN,
      );
    }

    await settings.updateOne({ ...dto });

    return this.settingsModel.findById(settings.id);
  }
  async getChatAdmins(id: string) {
    return await this.botService.getChatTGAdmins(id);
  }
  async promoteUser(
    dto: SetAdminPermissionsBodyDto,
    chatId: string,
    id: number,
  ) {
    return await this.botService.promoteUserToAdmin(chatId, id, dto);
  }
  async restrictAdmin(
    dto: SetRestrictPermissionsBodyDto,
    chatId: string,
    id: number,
  ) {
    return await this.botService.restrictAdminToUser(chatId, id, dto);
  }

  async changeSystemMessageNotifications(
    dto: CleanServiceMessageBodyDto,
    settingsId: string,
    token: string,
  ) {
    const settings = this.settingsModel.findById(settingsId);

    if (!settings) {
      throw new HttpException(
        'Document (Settings) not found',
        HttpStatus.NOT_FOUND,
      );
    }

    return await this.updateSettings(String(settingsId), dto, token);
  }
}
