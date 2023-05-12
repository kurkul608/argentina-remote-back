import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Chat } from 'src/chats/chats.schema';
import { CleanServiceMessageBodyDto } from 'src/setting/dto/body/clean-service-message-body.dto';

export type SettingsDocument = Settings & Document;
export enum MessageTypes {
  'new_member',
  'left_member',
  'video_call_start',
  'video_call_end',
  'auto_delete_timer_changed',
  'pinned_message',
}
export type MessageType = keyof typeof MessageTypes;
export const ServiceMessageArray = Object.keys(MessageTypes).filter(
  (k) => typeof MessageTypes[k as any] === 'number',
);
@Schema()
export class Settings {
  @ApiProperty()
  @Prop({ type: Boolean, required: true })
  remove_bots: boolean;

  @ApiProperty()
  @Prop({ type: CleanServiceMessageBodyDto, required: true })
  clear_system_messages: {
    clear_all: boolean;
    message_types: MessageType[];
  };

  @ApiProperty()
  @Prop({ required: true, type: Types.ObjectId, ref: Chat.name })
  chat: Types.ObjectId;
}

export const SettingsSchema = SchemaFactory.createForClass(Settings);
