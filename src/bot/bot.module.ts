import { forwardRef, Module } from '@nestjs/common';
import { BotUpdate } from './bot.update';
import { BotService } from './bot.service';
import { TelegrafModule } from 'nestjs-telegraf';
import { ConfigModule } from '@nestjs/config';
import { ChatsModule } from '../chats/chats.module';
import { BotController } from './bot.controller';
import { UserModule } from '../users/user.module';
import { AuthModule } from '../auth/auth.module';
import { SettingModule } from 'src/setting/setting.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import process from 'process';
import { RabbitMqModule } from 'src/rabbit-mq/rabbit-mq.module';
// import { TelegrafCustomModule } from '../telegraf-custom/telegraf-custom.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TelegrafModule.forRoot({
      token: process.env.TELEGRAM_API_KEY,
    }),
    ClientsModule.register([
      {
        name: 'CRON_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [`amqp://${process.env.RABBIT_MQ_HOST}:5672`],
          queue: 'cron_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
    forwardRef(() => ChatsModule),
    forwardRef(() => SettingModule),
    forwardRef(() => UserModule),
    forwardRef(() => AuthModule),
    forwardRef(() => RabbitMqModule),
  ],
  controllers: [BotController],
  providers: [BotService, BotUpdate],
  exports: [BotService],
})
export class BotModule {}
