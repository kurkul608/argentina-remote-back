import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { Context, Markup, Telegraf } from 'telegraf';
import { MessageDocument } from '../message/message.schema';
import { ButtonTypeEnum } from '../message/constants/button-type.enum';
import tt from 'typegram';
import { ChatsService } from '../chats/chats.service';
import { SetRestrictPermissionsBodyDto } from 'src/setting/dto/body/set-restrict-permissions-body.dto';
import { SetAdminPermissionsBodyDto } from 'src/setting/dto/body/set-admin-permissions-body.dto';
import { isBot } from 'src/bot/bot.utils';
import { SettingService } from 'src/setting/setting.service';
import { ServiceMessageType } from 'src/setting/interfaces/service-message.interface';

// type Hideable<B> = B & { hide?: boolean };
@Injectable()
export class BotService {
  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,
    @Inject(forwardRef(() => ChatsService))
    private readonly chatService: ChatsService,
    @Inject(forwardRef(() => SettingService))
    private readonly settingService: SettingService,
  ) {}

  async sendMessage(
    chatId: number,
    message: MessageDocument,
    pinMessage: boolean,
  ) {
    const buttonLinks: tt.InlineKeyboardButton[][] = [
      ...message.keyboard,
    ].reduce(
      (accRow: tt.InlineKeyboardButton[][], buttonRow) => [
        ...accRow,
        buttonRow.reduce(
          (accCell: tt.InlineKeyboardButton[], buttonCell) => [
            ...accCell,
            buttonCell.type === ButtonTypeEnum.link
              ? Markup.button.url(buttonCell.link.text, buttonCell.link.url)
              : Markup.button.callback(
                  buttonCell.hidden_text_button.button_text,
                  'data',
                ),
          ],
          [],
        ),
      ],
      [],
    );

    const messageText = message.quill_delta?.reduce(
      (acc, str) => `${acc}\n${str}`,
      '',
    );

    await this.bot.telegram
      .sendMessage(chatId, messageText, {
        disable_notification: message.notifications,
        ...Markup.inlineKeyboard(buttonLinks),
      })
      .then((mes) => {
        if (pinMessage) {
          return this.bot.telegram.pinChatMessage(chatId, mes.message_id);
        }
      });
    return;
  }

  async getChatInfoById(chatId: number) {
    const chatInfo = await this.bot.telegram.getChat(chatId);
    return chatInfo;
  }

  async getChatMembersById(chatId: number) {
    const chatMembersCount = await this.bot.telegram.getChatMembersCount(
      chatId,
    );
    return chatMembersCount;
  }

  getBotName() {
    return process.env.TELEGRAM_API_NAME;
  }

  async getFileLink(filePath: string) {
    return await this.bot.telegram.getFileLink(filePath);
  }

  async getChatTGInfo(chatId: number) {
    const chatInfo = await this.getChatInfoById(chatId);
    const chatMembersCount = await this.getChatMembersById(chatId);
    // const chatInfo = await this.bot.telegram.getChat(chatId);
    const photos = chatInfo.photo;
    const photosLinks = {
      small: photos?.small_file_id
        ? await this.getFileLink(photos.small_file_id)
        : undefined,
      big: photos?.big_file_id
        ? await this.getFileLink(photos.big_file_id)
        : undefined,
    };
    return {
      chatInfo,
      chatMembersCount,
      photos: photosLinks,
    };
  }

  async getChatTGAdmins(chatId: string) {
    const {
      tg_chat_info: {
        chat_info: { id },
      },
    } = await this.chatService.getChatById(chatId);
    const data = await this.bot.telegram.getChatAdministrators(id);
    const total = data.length;
    return {
      data,
      total,
    };
  }

  async promoteUserToAdmin(
    chatId: string,
    id: number,
    params: SetAdminPermissionsBodyDto,
  ) {
    const {
      tg_chat_info: {
        chat_info: { id: tgChatId },
      },
    } = await this.chatService.getChatById(chatId);
    return await this.bot.telegram.promoteChatMember(tgChatId, id, params);
  }

  async restrictAdminToUser(
    chatId: string,
    id: number,
    params: SetRestrictPermissionsBodyDto,
  ) {
    const {
      tg_chat_info: {
        chat_info: { id: tgChatId },
      },
    } = await this.chatService.getChatById(chatId);
    return await this.bot.telegram.restrictChatMember(tgChatId, id, params);
  }

  async deleteMessageFromChat(chatId: number, id: number) {
    return await this.bot.telegram.deleteMessage(chatId, id);
  }

  async checkByBot(chatId: number, user: tt.User, from?: tt.User) {
    if (isBot(user)) {
      const isNeedToRemove = (
        await this.settingService.getByChatIdSettings(['remove_bots'], chatId)
      )?.remove_bots;

      isNeedToRemove &&
        (await this.banUserWithClearMessages(chatId, user.id, from));
    }
    return;
  }

  async banUserWithClearMessages(chatId, userId: number, from?: tt.User) {
    const admins = await this.bot.telegram.getChatAdministrators(chatId);
    !!from &&
      !admins.find((admin) => admin.user.id === from.id) &&
      (await this.bot.telegram
        .banChatMember(chatId, userId, undefined, {
          revoke_messages: true,
        })
        .then(() => {
          return this.bot.telegram.sendMessage(
            chatId,
            'The administrator has banned the addition of bots',
          );
        }));
    return;
  }

  async checkSystemMessagesSettings(
    chatId: number,
    serviceName: ServiceMessageType,
    messageId: number,
  ) {
    const clearSystemMessages = (
      await this.settingService.getByChatIdSettings(
        ['clear_system_messages'],
        chatId,
      )
    )?.clear_system_messages;
    if (clearSystemMessages) {
      if (clearSystemMessages?.clear_all) {
        await this.deleteMessageFromChat(chatId, messageId);
        return;
      } else {
        if (clearSystemMessages.message_types.includes(serviceName)) {
          await this.deleteMessageFromChat(chatId, messageId);
          return;
        }
      }
    }
  }

  async checkMessagesByChannel(
    chatId: number,
    user: tt.User,
    messageId: number,
  ) {
    if (isBot(user)) {
      await this.deleteMessageFromChat(chatId, messageId).then(() => {
        return this.bot.telegram.sendMessage(
          chatId,
          'In the group is prohibited to write on behalf of channels',
        );
      });
      return;
    }
  }
}
