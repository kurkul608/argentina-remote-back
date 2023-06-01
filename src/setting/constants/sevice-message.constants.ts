import { ServiceMessageType } from 'src/setting/interfaces/service-message.interface';

export const serviceMessages: ServiceMessageType[] = [
  'new_member',
  'left_member',
  'video_call_start',
  'video_call_end',
  'auto_delete_timer_changed',
  'pinned_message',
  'new_chat_photo',
  'new_chat_title',
];
