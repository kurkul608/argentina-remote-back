import tt from 'typegram';

export type ChatType = 'group' | 'supergroup' | 'channel' | 'private';

export const isPrivateOrChannel = (chatType: ChatType) => {
  return isChannel(chatType) || chatType === 'private';
};

export const isChannel = (chatType: ChatType) => {
  return chatType === 'channel';
};
export const isPrivate = (chatType: ChatType) => {
  return chatType === 'private';
};
export const isGroup = (chatType: ChatType) => {
  return chatType === 'group' || chatType === 'supergroup';
};
export const isBot = (user: tt.User) => {
  return user.is_bot;
};
