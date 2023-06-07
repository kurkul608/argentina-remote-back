export class DeleteMessageEvent {
  constructor(
    public readonly chat_id: number,
    public readonly message_id: number,
  ) {}
}
