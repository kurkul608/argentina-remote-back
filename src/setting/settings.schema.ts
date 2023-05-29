import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Chat } from 'src/chats/chats.schema';
import { ServiceMessageType } from 'src/setting/interfaces/service-message.interface';

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
  @Prop({ type: [String] })
  message_types: ServiceMessageType[];
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
  clear_system_messages: IClearServiceMessages;

  @ApiProperty()
  @Prop({ required: true, type: Types.ObjectId, ref: Chat.name })
  chat: Types.ObjectId;
}

export const SettingsSchema = SchemaFactory.createForClass(Settings);
