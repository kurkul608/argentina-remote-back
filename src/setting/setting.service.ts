import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import _ from 'lodash';
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
import { RedisClientService } from 'src/redis-client/redis-client.service';
import { serviceMessages } from 'src/setting/constants/sevice-message.constants';

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
    @Inject(forwardRef(() => RedisClientService))
    private readonly redisClientService: RedisClientService,
  ) {
    // this.redisClientService.setData('testKey', {
    //   data: { text: 'text key, data, text' },
    // });
    // this.redisClientService
    //   .getData('testKey')
    //   .then((data) => console.log(data));
    // this.settingsModel
    //   .findById('645b09836542bc3cecf95fbd')
    //   .then((data) => console.log(data));
  }

  getRedisKeyForSettings(chatId: number) {
    return `chatId-${chatId}-settings`;
  }

  async getSettings(
    settingsField: Array<keyof Settings>,
    chatId: number,
  ): Promise<Partial<Settings>> {
    let settings = await this.redisClientService.getData(
      this.getRedisKeyForSettings(chatId),
    );

    if (!settings) {
      const chat = await this.chatsService.findByTgId(chatId);
      settings = await this.settingsModel.findOne({ chat: chat._id });
      await this.redisClientService.setData(
        this.getRedisKeyForSettings(chat.tg_chat_info.chat_info.id),
        {
          ...settings,
        },
      );
    }
    return _.pick(settings, settingsField);
  }

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

    const settings = await this.settingsModel.create({
      ...dto,
      remove_bots: false,
      clear_system_messages: {
        clear_all: false,
        message_types: [],
      },
      chat: chat._id,
    });

    await this.redisClientService.setData(
      this.getRedisKeyForSettings(chat.tg_chat_info.chat_info.id),
      {
        ...dto,
        remove_bots: false,
        clear_system_messages: {
          clear_all: false,
          message_types: serviceMessages,
        },
      },
    );

    return settings;
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

    const redisData = await this.redisClientService.getData(
      this.getRedisKeyForSettings(chat.tg_chat_info.chat_info.id),
    );

    await this.redisClientService.setData(
      this.getRedisKeyForSettings(chat.tg_chat_info.chat_info.id),
      {
        ...redisData,
        ...dto,
      },
    );

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
}
