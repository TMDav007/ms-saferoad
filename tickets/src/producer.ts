import amqp, { Connection } from "amqplib/callback_api";
import amqplib from "amqplib";
import { AppError } from "@sfroads/common";

const createMQProducer = (amqUrl: string, queueName: string) => {
  console.log("Connecting to RabbitMQ...");
  let ch: any;
  amqp.connect(amqUrl, (errorConnect: Error, connection: Connection) => {
    if (errorConnect) {
      console.log("Error connecting to RabbitMQ", errorConnect);
      return;
    }

    connection.createChannel((errorChannel, channel) => {
      if (errorChannel) {
        console.log("Error creating RabbitMQ channel", errorChannel);
        return;
      }

      ch = channel;
      console.log("Created RabbitMQ channel");
    });
  });

  return (msg: string) => {
    console.log("Producer message to RabbitMQ...");
    ch.sendToQueue(queueName, Buffer.from(msg));
  };
};

export default createMQProducer;


// Message Broker

export const CreateChannel = async () => {
  try {
    const connection = await amqplib.connect(process.env.MESSAGE_BROKER_URL!);
    const channel = await connection.createChannel();
    await channel.assertExchange(process.env.EXCHANGE_NAME!, "direct", {durable:false});
    return channel;
  } catch (err: any) {
    throw new AppError(500, err?.message);
  }
};

export const PublishMessage = async (channel: any, binding_key: any, message: any) => {
  try {
    await channel.publish(
      process.env.EXCHANGE_NAME,
      message,
      binding_key,
      Buffer.from(message)
    );
  } catch (err: any) {
    throw new AppError(500, err?.message);
  }
};

export const SubscribeMessage = async (channel: any, service: any, binding_key: any) => {
  const appQueue = new channel.assertQueue('QUEUE_NAME');

  channel.bindQueue(appQueue.queue, process.env.EXCHANGE_NAME, binding_key);

  channel.consume(appQueue.queue, (data: any) => {
    console.log("recieved data");
    console.log(data.content.toString());
    channel.ack(data);
  });
};

