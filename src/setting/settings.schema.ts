import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Chat } from 'src/chats/chats.schema';
import { ServiceMessageType } from 'src/setting/interfaces/service-message.interface';
import { IsOptional } from 'class-validator';
import { MAX_MESSAGE_LENGTH } from 'src/commoon/constants/message.constants';

export interface IBanWords {
  is_enabled: boolean;
  dictionary: string[];
}

@Schema()
export class BanWords {
  @ApiProperty()
  @Prop({ type: Boolean, required: true })
  is_enabled: boolean;

  @Prop({ type: [String], required: true })
  dictionary: string[];
}

export const BanWordsSchema = SchemaFactory.createForClass(BanWords);

export interface IStickerCleaner {
  remove_stickers: boolean;
  remove_gif: boolean;
  remove_emoji: boolean;
}

@Schema()
export class StickerCleaner {
  @ApiProperty()
  @Prop({ type: Boolean, required: true })
  remove_stickers: boolean;

  @Prop({ type: Boolean, required: true })
  remove_gif: boolean;

  @Prop({ type: Boolean, required: true })
  remove_emoji: boolean;
}

export const StickerCleanerSchema =
  SchemaFactory.createForClass(StickerCleaner);

export interface IGreeting {
  is_enable: boolean;
  previous_greetings?: number[];
  clear_last_message?: boolean;
  message?: string;
  clear_time?: string;
}

@Schema()
export class Greeting {
  @ApiProperty()
  @Prop({ type: Boolean, required: true })
  is_enable: boolean;

  @ApiProperty()
  @Prop({ type: [Number], required: false })
  previous_greetings: number[];

  @ApiProperty()
  @Prop({ type: String, required: false })
  message?: string;

  @ApiProperty()
  @Prop({ type: String, required: false })
  clear_time?: string;

  @ApiProperty()
  @Prop({ type: Boolean, required: false })
  clear_last_message?: boolean;
}

export const GreetingSchema = SchemaFactory.createForClass(Greeting);

export interface IClearServiceMessages {
  clear_all: boolean;
  message_types: ServiceMessageType[];
}

export interface IMessageCharacterLimit {
  is_enable: boolean;
  character_limit?: number;
  message?: string;
}

@Schema()
export class MessageLengthLimit {
  @ApiProperty()
  @Prop({ type: Boolean, required: true })
  is_enable: boolean;

  @ApiProperty()
  @Prop({ type: Number, required: false, default: MAX_MESSAGE_LENGTH })
  character_limit: number;

  @ApiProperty()
  @Prop({ type: String, required: false })
  message?: string;
}
export const MessageLengthLimitSchema =
  SchemaFactory.createForClass(MessageLengthLimit);

export interface IClearByChannelMessages {
  isEnable: boolean;
  text?: string;
}

@Schema()
export class ByChannelMessages {
  @ApiProperty()
  @Prop({ type: Boolean, required: true })
  isEnable: boolean;

  @ApiProperty()
  @Prop({ type: String, required: false })
  text?: string;
}

@Schema()
export class ServiceMessages {
  @ApiProperty({ type: Boolean, required: true })
  @Prop()
  clear_all: boolean;

  @ApiProperty()
  @Prop({ type: [String] })
  message_types: ServiceMessageType[];
}

export const MessagesByChannelSchema =
  SchemaFactory.createForClass(ByChannelMessages);

export const ServiceMessagesSchema =
  SchemaFactory.createForClass(ServiceMessages);

export type SettingsDocument = Settings & Document;

@Schema()
export class Settings {
  @ApiProperty()
  @Prop({ type: Boolean, required: true })
  remove_bots: boolean;

  @ApiProperty()
  @Prop({
    type: ServiceMessagesSchema,
    required: true,
    ref: ServiceMessages.name,
  })
  clear_system_messages: IClearServiceMessages;

  @ApiProperty()
  @Prop({
    type: GreetingSchema,
    required: true,
    ref: Greeting.name,
  })
  greeting: IGreeting;

  @ApiProperty()
  @Prop({
    type: MessagesByChannelSchema,
    required: true,
    ref: ByChannelMessages.name,
  })
  clear_messages_by_channel: IClearByChannelMessages;

  @ApiProperty()
  @Prop({
    type: StickerCleanerSchema,
    required: true,
    ref: StickerCleaner.name,
  })
  sticker_cleaner: IStickerCleaner;

  @ApiProperty()
  @Prop({
    type: BanWordsSchema,
    required: true,
    ref: BanWords.name,
  })
  ban_words: IBanWords;

  @ApiProperty()
  @Prop({
    type: MessageLengthLimitSchema,
    required: true,
    ref: MessageLengthLimit.name,
  })
  message_character_limit: IMessageCharacterLimit;

  @ApiProperty()
  @Prop({ required: true, type: Types.ObjectId, ref: Chat.name })
  chat: Types.ObjectId;
}

export const SettingsSchema = SchemaFactory.createForClass(Settings);
