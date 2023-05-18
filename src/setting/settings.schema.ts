import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Chat } from 'src/chats/chats.schema';
import {
  ServiceMessages as ServiceType,
  ServiceMessageType,
} from 'src/setting/interfaces/service-message.interface';
import { ValidateNested } from 'class-validator';

export interface IClearServiceMessages {
  clear_all: boolean;
  message_types: ServiceMessageType[];
}

@Schema()
export class ServiceMessages {
  @ApiProperty()
  @Prop()
  clear_all: boolean;

  @ApiProperty()
  @Prop({ type: [String], enum: ServiceType })
  message_types: ServiceType[];
}
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
  @ValidateNested()
  clear_system_messages: IClearServiceMessages;

  @ApiProperty()
  @Prop({ required: true, type: Types.ObjectId, ref: Chat.name })
  chat: Types.ObjectId;
}

export const SettingsSchema = SchemaFactory.createForClass(Settings);
