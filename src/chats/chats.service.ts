import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Chat, ChatDocument } from './chats.schema';
import { Model, Types } from 'mongoose';
import { CreateChatDto } from './create-chat.dto';
import { BotService } from '../bot/bot.service';
import { PaymentType } from '../payment/dto/create-payment.dto';
import { PaymentService } from '../payment/payment.service';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/users/user.service';
import { SettingService } from 'src/setting/setting.service';
import { CreateSettingsDto } from 'src/setting/dto/create-settings.dto';

@Injectable()
export class ChatsService {
  constructor(
    @InjectModel(Chat.name) private readonly chatModel: Model<ChatDocument>,
    @Inject(forwardRef(() => BotService))
    private readonly botService: BotService,
    @Inject(forwardRef(() => PaymentService))
    private readonly paymentService: PaymentService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(forwardRef(() => SettingService))
    private readonly settingsService: SettingService,
  ) {}

  async create(createChatDto: CreateChatDto, userTgId: number) {
    const { _id } = await this.userService.findById(userTgId);

    const tgInfo = await this.botService.getChatTGInfo(createChatDto.id);

    const chat = await this.chatModel.create({
      ...createChatDto,
      is_hidden: !!createChatDto.isHidden,
      tg_chat_info: {
        chat_info: tgInfo.chatInfo,
        photos: tgInfo.photos,
        chat_members_count: tgInfo.chatMembersCount,
      },
      owner: _id,
    });
    const settingsDto: CreateSettingsDto = {};

    await this.settingsService.createSettings(chat._id, settingsDto, _id);

    return chat;
  }

  async checkChatExist(chatId: number) {
    const chatsCount = await this.chatModel.countDocuments({
      'tg_chat_info.chat_info.id': chatId,
    });
    return chatsCount > 0;
  }

  async findByTgId(id: number) {
    const chat = await this.chatModel.findOne({
      'tg_chat_info.chat_info.id': id,
    });

    // if (!chat) {
    //   throw new HttpException(
    //     'Document (Chat) not found',
    //     HttpStatus.NOT_FOUND,
    //   );
    // }

    return chat;
  }
  async findAndUpdateId(id: number, newId: number) {
    const chat = await this.findByTgId(id);
    await chat.updateOne({ id: newId });
    return await this.findByTgId(newId);
  }

  async findAllByIds(ids: number[]) {
    return this.chatModel.find().where('id').in(ids);
  }

  async changeVisible(chatId: string, isHidden: boolean) {
    const chat = await this.getChat(chatId);
    if (chat) {
      await chat.updateOne({ isHidden });
    }
    return chat;
  }
  async getChat(chatId: string) {
    const chat = await this.chatModel.findById(chatId);

    if (!chat) {
      throw new HttpException(
        'Document (Chat) not found',
        HttpStatus.NOT_FOUND,
      );
    }

    return chat;
  }
  async getChatById(chatId: string) {
    const chat = await this.chatModel.findById(chatId);

    if (!chat) {
      throw new HttpException(
        'Document (Chat) not found',
        HttpStatus.NOT_FOUND,
      );
    }
    return chat;
  }
  async getAll(limit: number, offset: number, isHidden?: boolean, q?: string) {
    const filters = {};
    if (typeof isHidden === 'boolean') {
      filters['is_hidden'] = isHidden;
    }
    if (q) {
      filters['tg_chat_info.chat_info.title'] = { $regex: new RegExp(q, 'i') };
    }
    const chatsFromDB = await this.chatModel
      .find({ ...filters })
      .limit(limit)
      .skip(offset);
    const totalCount = await this.chatModel.find({ ...filters }).count();
    // const data = [];
    // for (const chat of chatsFromDB) {
    //   const chatTGInfo = await this.botService.getChatTGInfo(chat.id);
    //   console.log(chat.id);
    //   const fullChatInfo = {
    //     chat,
    //     ...chatTGInfo,
    //   };
    //   data.push(fullChatInfo);
    // }

    return {
      total: totalCount,
      data: chatsFromDB,
    };
  }

  async getChatInfo(chatId: string, paymentType?: PaymentType) {
    const chat = await this.getChat(chatId);
    const chatTGInfo = await this.botService.getChatTGInfo(
      chat.tg_chat_info.chat_info.id,
    );
    await chat.updateOne({ ...chatTGInfo });

    return chat;
  }

  async getChatsByIds(ids: string[]) {
    const objectIds = ids.map((id) => new Types.ObjectId(id));
    const chats = await this.chatModel.find({ _id: { $in: objectIds } }).exec();

    return chats;
  }
}
