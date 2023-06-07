export class CronDeleteMessageEvent {
  constructor(
    public readonly chat_id: number,
    public readonly message_id: number,
    public readonly milliseconds: number,
  ) {}
}
