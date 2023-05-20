import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Chat } from 'src/chats/chats.schema';
import { CleanServiceMessageBodyDto } from 'src/setting/dto/body/clean-service-message-body.dto';
import { ServiceMessageType } from 'src/setting/interfaces/service-message.interface';

export type SettingsDocument = Settings & Document;

@Schema()
export class Settings {
  @ApiProperty()
  @Prop({ type: Boolean, required: true })
  remove_bots: boolean;

  @ApiProperty()
  @Prop({ type: CleanServiceMessageBodyDto, required: true })
  clear_system_messages: {
    clear_all: boolean;
    message_types: ServiceMessageType[];
  };

  @ApiProperty()
  @Prop({ required: true, type: Types.ObjectId, ref: Chat.name })
  chat: Types.ObjectId;
}

export const SettingsSchema = SchemaFactory.createForClass(Settings);
