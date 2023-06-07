import { Injectable } from '@nestjs/common';
import { connect } from 'amqplib';
import process from 'process';

@Injectable()
export class RabbitMqService {
  private readonly rabbitMQConnectionString: string = `amqp://${process.env.RABBIT_MQ_HOST}:5672`;

  async listenToQueue(
    queueName: string,
    callback: (message: any) => void,
  ): Promise<void> {
    const connection = await connect(this.rabbitMQConnectionString);
    const channel = await connection.createChannel();
    await channel.assertQueue(queueName, { durable: true });

    channel.consume(queueName, (msg) => {
      if (msg !== null) {
        const message = JSON.parse(msg.content.toString());
        callback(message);
        channel.ack(msg);
      }
    });
  }
}
