import { forwardRef, Module } from '@nestjs/common';
import { ChatsController } from './chats.controller';
import { ChatsService } from './chats.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatSchema, Chat } from './chats.schema';
import { BotModule } from '../bot/bot.module';
import { PaymentModule } from '../payment/payment.module';
import { UserModule } from 'src/users/user.module';
import { SettingModule } from 'src/setting/setting.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
    forwardRef(() => BotModule),
    forwardRef(() => PaymentModule),
    forwardRef(() => UserModule),
    forwardRef(() => AuthModule),
    forwardRef(() => SettingModule),
  ],
  controllers: [ChatsController],
  providers: [ChatsService],
  exports: [ChatsService],
})
export class ChatsModule {}
