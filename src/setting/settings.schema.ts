import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Chat } from 'src/chats/chats.schema';

export type SettingsDocument = Settings & Document;

@Schema()
export class Settings {
  @ApiProperty()
  @Prop({ type: Boolean, required: true })
  remove_bots: boolean;

  @ApiProperty()
  @Prop({ type: Object, required: true })
  system_messages_notification: {
    new_member: boolean;
    left_member: boolean;
    video_call_start: boolean;
    video_call_end: boolean;
    auto_delete_timer_changed: boolean;
    pinned_message: boolean;
  };

  @ApiProperty()
  @Prop({ required: true, type: Types.ObjectId, ref: Chat.name })
  chat: Types.ObjectId;
}

export const SettingsSchema = SchemaFactory.createForClass(Settings);
