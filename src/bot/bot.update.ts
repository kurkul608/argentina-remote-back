import {
  Ctx,
  InjectBot,
  Message,
  On,
  Start,
  Update,
  Action,
} from 'nestjs-telegraf';
import {
  Context,
  Markup,
  Telegraf,
  NarrowedContext,
  // TelegrafContext,
} from 'telegraf';
// import { editedMessage, channelPost } from "telegraf/filters";
import { ChatsService } from '../chats/chats.service';
import { isPrivate } from './bot.utils';
import { CreateChatDto } from '../chats/create-chat.dto';
import { forwardRef, Inject } from '@nestjs/common';
import { UserService } from '../users/user.service';
import { Public } from '../auth/public-route.decorator';
import { AuthService } from '../auth/auth.service';
import tt from 'typegram';
import { BotService } from 'src/bot/bot.service';

@Update()
export class BotUpdate {
  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,
    @Inject(forwardRef(() => ChatsService))
    private readonly chatsService: ChatsService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    @Inject(forwardRef(() => BotService))
    private readonly botService: BotService,
  ) {}

  @Public()
  @Start()
  async startCommand(
    @Message('from') from,
    @Message('chat') chat,
    @Ctx() ctx: Context,
  ) {
    if (isPrivate(chat.type)) {
      const isOldUser = await this.userService.findById(from.id);
      if (!isOldUser) {
        await this.userService.create({
          ...ctx.from,
          language_code: from.language_code ?? 'en',
        });
      }
      await ctx.reply('Привет, можешь выбрть интересующую тебя функцию', {
        reply_markup: {
          keyboard: [[{ text: 'Получить токен' }]],
        },
      });
    } else {
      await ctx.reply('Hi');
    }
    return;
  }

  @Public()
  @On('new_chat_members')
  async newChatMember(
    @Message('from')
    from: tt.User,
    @Message('new_chat_member')
    member: tt.User,
    @Ctx() ctx: Context,
  ) {
    await this.botService.deleteMessageFromChat(
      ctx.chat.id,
      ctx.message.message_id,
    );

    await this.botService.checkByBot(ctx.chat.id, member, from);

    const botName = process.env.TELEGRAM_API_NAME;
    if (!isPrivate(ctx.chat.type)) {
      if (member.is_bot) {
        if (member.username === botName) {
          // await ctx.reply('Здарова удаленщики');
          const isChat = await this.chatsService.checkChatExist(ctx.chat.id);
          if (!isChat) {
            await this.chatsService.create(ctx.chat as CreateChatDto, from.id);
          }
          return;
        }
      }
    }
  }

  @Public()
  @On('left_chat_member')
  async leftChatMember(
    @Message('left_chat_member')
    member: tt.User,
    @Ctx() ctx: Context,
  ) {
    await this.botService.deleteMessageFromChat(
      ctx.chat.id,
      ctx.message.message_id,
    );
    const botName = process.env.TELEGRAM_API_NAME;
    if (member.is_bot && member.username === botName) {
      const chat = await this.chatsService.findByTgId(ctx.chat.id);
      if (chat) {
        await chat.remove();
        return;
      }
      return;
    }
  }

  @Public()
  @On('pinned_message')
  async pinnedMessage(@Ctx() ctx: Context) {
    await this.botService.deleteMessageFromChat(
      ctx.chat.id,
      ctx.message.message_id,
    );
    return;
  }

  @Public()
  @On('message_auto_delete_timer_changed')
  async autoDeleteTimer(@Ctx() ctx: Context) {
    await this.botService.deleteMessageFromChat(
      ctx.chat.id,
      ctx.message.message_id,
    );
  }

  @Public()
  @On('video_chat_started')
  async videoChatStarted(@Ctx() ctx: Context) {
    await this.botService.deleteMessageFromChat(
      ctx.chat.id,
      ctx.message.message_id,
    );
  }

  @Public()
  @On('video_chat_ended')
  async videoChatEnded(@Ctx() ctx: Context) {
    await this.botService.deleteMessageFromChat(
      ctx.chat.id,
      ctx.message.message_id,
    );
  }

  @Public()
  @On('group_chat_created')
  async groupCreated(
    @Message('chat') chat: any,
    @Message('group_chat_created') flag: boolean,
    @Message('from') user: tt.User,
    @Ctx() ctx: Context,
  ) {
    if (flag) {
      const isChat = await this.chatsService.checkChatExist(ctx.chat.id);
      if (!isChat) {
        await this.chatsService.create(chat as CreateChatDto, user.id);
      }
    }
  }

  @Public()
  @On('migrate_from_chat_id')
  async migrateTest(
    @Ctx()
    ctx: NarrowedContext<
      Context,
      {
        update_id: number;
        message: tt.Message.MigrateFromChatIdMessage;
      } & tt.Update
    >,
  ) {
    const fromChatId = ctx.update.message.migrate_from_chat_id;
    const senderChat = ctx.update.message.sender_chat;
    const newId = senderChat.id;
    const chat = await this.chatsService.findAndUpdateId(fromChatId, newId);
    if (chat) {
      await this.bot.telegram.sendMessage(newId, 'Chat data has been updated');
      return;
    }
  }

  @Public()
  @On('message')
  async messageHandler(
    @Message('text') msg: string,
    @Message('from') user: tt.User,
    @Ctx()
    ctx: Context,
  ) {
    if (!msg) {
      return;
    }
    if (isPrivate(ctx.chat.type)) {
      const { from } = ctx.message;
      if (msg === 'Получить токен') {
        const { access_token } = await this.authService.login(from);
        const href = `${process.env.FRONT_URL}/auth/${access_token}`;
        await ctx.reply(
          `Ваша ссылка для входа: ${
            process.env.MODE === 'DEVELOP' ? href : ''
          }`,
          process.env.MODE !== 'DEVELOP'
            ? Markup.inlineKeyboard([Markup.button.url(href, href)])
            : {},
        );
      }
    }
    return;
  }

  @Public()
  @Action('data')
  async callBack(
    @Ctx()
    ctx: NarrowedContext<Context, tt.Update.CallbackQueryUpdate>,
    // @UpdateType() updateType: TelegrafUpdateType,
  ) {
    // console.log(ctx.update.callback_query.message);
    return;
  }
  // @Public()
  // @On('channel_post')
  // async channelPostHandler(@Ctx() ctx: Context) {
  //   const chat = await this.chatsService.findById(ctx.chat.id);
  //   if (!chat) {
  //     await this.chatsService.create(ctx.chat as CreateChatDto);
  //   }
  //   return;
  // }
  //
  // @Public()
  // @On('edited_channel_post')
  // async editChannelPostHandler(@Ctx() ctx: Context) {
  //   const chat = await this.chatsService.findById(ctx.chat.id);
  //   if (!chat) {
  //     await this.chatsService.create(ctx.chat as CreateChatDto);
  //   }
  //   return;
  // }
}
