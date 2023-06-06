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
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      process.env.MONGO_URI,
      // `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@mongodb_container:27017`,
    ),
    RedisModule.forRoot({
      config: {
        host: process.env.REDIS,
        port: +process.env.REDIS_PORT,
      },
    }),
    ClientsModule.register([
      {
        name: 'CRON',
        transport: Transport.TCP,
      },
    ]),
    CacheModule.register(),
    // CacheModule.register({
    //   store: redisStore,
    //   host: 'localhost',
    //   port: 6379,
    //   ttl: 2000,
    //   isGlobal: true,
    // }),
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
