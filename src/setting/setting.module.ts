import { forwardRef, Module } from '@nestjs/common';
import { SettingService } from './setting.service';
import { SettingController } from './setting.controller';
import { BotModule } from '../bot/bot.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Settings, SettingsSchema } from 'src/setting/settings.schema';
import { ChatsModule } from 'src/chats/chats.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Settings.name, schema: SettingsSchema },
    ]),
    forwardRef(() => BotModule),
    forwardRef(() => ChatsModule),
    forwardRef(() => AuthModule),
  ],
  providers: [SettingService],
  controllers: [SettingController],
  exports: [SettingService],
})
export class SettingModule {}
