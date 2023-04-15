import { AppError } from "@sfroads/common";
import amqp, { Connection, Message, Channel } from "amqplib/callback_api";
import amqplib from "amqplib";

// export const SubscribeMessage = async (channel: any, binding_key: any) => {
//   const appQueue = await channel.assertQueue(process.env.EXCHANGE_NAME);

//   channel.bindQueue(
//     appQueue.queue,
//     process.env.EXCHANGE_NAME!,
//     process.env.USER_BINDING_KEY!
//   );
//   console.log("heree");
//   channel.consume(appQueue.queue, (data: any) => {
//     console.log("recieved data");
//     console.log(data.content.toString());
//     channel.ack(data);
//   });
// };

const createMQConsumer = (amqpURI: string, queueName: string) => {
  let ch: any;
  console.log("Connecting to RabbitMQ...");
  amqp.connect(amqpURI, (errConn, conn) => {
    if (errConn) {
      throw new AppError(500, errConn);
    }

    conn.createChannel((errChan, chan) => {
      if (errChan) {
        throw new AppError(500, errChan);
      }

      console.log("Connected to RabbitMQ", chan);
      ch = chan;
    });
  });
  return (action: any, ch: any) => {
    console.log(ch);
    ch?.assertQueue(queueName, { durable: true });
    ch?.consume(
      queueName,
      (msg: Message | null) => {
        if (msg) {
          const parsed = JSON.parse(msg.content.toString());
          switch (parsed.action) {
            case action:
              console.log("Consming LOGIN Action", parsed.data);
              break;

            default:
              break;
          }
        }
      },
      { noAck: true }
    );
  };
};

export default createMQConsumer;

// Message Broker
export const CreateChannel = async () => {
  try {
    const connection = await amqplib.connect(process.env.AMQP_URL!);
    const channel = await connection.createChannel();
    await channel.assertExchange(process.env.EXCHANGE_NAME!, "direct", {
      durable: true,
    });
    return channel;
  } catch (err: any) {
    throw new AppError(500, err?.message);
  }
};

export const PublishMessage = async (
  channel: any,
  binding_key: any,
  message: any
) => {
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

export const SubscribeMessage = async (channel: any, service: any) => {
  await channel.assertExchange(process.env.EXCHANGE_NAME, "direct", {
    durable: true,
  });
  const q = await channel.assertQueue("", { exclusive: true });
  channel.bindQueue(
    q.queue,
    process.env.EXCHANGE_NAME,
    process.env.USER_BINDING_KEY
  );

  channel.consume(
    q.queue,
    (msg: Message | null) => {
      if (msg) {
        console.log("recieved data");
        console.log(msg?.content.toString());
        service(msg.content.toString());
        channel.ack(msg);
      }
    },
    { noAck: false }
  );
};
