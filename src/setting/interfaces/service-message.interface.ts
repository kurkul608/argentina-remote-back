export type ServiceMessageType =
  | 'new_member'
  | 'left_member'
  | 'video_call_start'
  | 'video_call_end'
  | 'auto_delete_timer_changed'
  | 'pinned_message';
