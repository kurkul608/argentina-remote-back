import { CacheInterceptor, CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatsModule } from './chats/chats.module';
import { MessageModule } from './message/message.module';
import { BotModule } from './bot/bot.module';
import { PaymentModule } from './payment/payment.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { RedisClientModule } from './redis-client/redis-client.module';
import { TronCoreModule } from './tron-core/tron-core.module';
import { TronModule } from './tron/tron.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/user.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { PostModule } from './post/post.module';
import { SettingModule } from './setting/setting.module';
import { RabbitMqModule } from './rabbit-mq/rabbit-mq.module';
import * as process from 'process';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI),
    RedisModule.forRoot({
      config: {
        host: process.env.REDIS,
        port: +process.env.REDIS_PORT,
      },
    }),

    CacheModule.register(),
    ChatsModule,
    MessageModule,
    BotModule,
    PaymentModule,
    RedisClientModule,
    TronCoreModule,
    TronModule,
    AuthModule,
    UserModule,
    PostModule,
    SettingModule,
    RabbitMqModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
