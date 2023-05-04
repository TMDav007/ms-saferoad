import { AppError } from "@sfroads/common";
import { Message, Channel } from "amqplib/callback_api";
import amqplib from "amqplib";
import { v4 as uuid4 } from "uuid";

let amqplibConnection: any = null;
//Message Broker
const getChannel = async () => {
  if (amqplibConnection === null) {
    amqplibConnection = await amqplib.connect(process.env.AMQP_URL!);
  }
  return await amqplibConnection.createChannel();
};

export const CreateChannel = async () => {
  try {
    const channel = await getChannel();
    await channel.assertQueue(process.env.EXCHANGE_NAME, "direct", {
      durable: true,
    });
    return channel;
  } catch (err: any) {
    throw new AppError(500, err?.message);
  }
};

export const PublishMessage = async (
  channel: Channel,
  service: string,
  msg: any
) => {
  try {
    await channel.publish(
      process.env.EXCHANGE_NAME!,
      service,
      Buffer.from(msg)
    );
    console.log("Sent: ", msg);
  } catch (err: any) {
    throw new AppError(500, err?.message);
  }
};

// export const SubscribeMessage = async (channel: any, service: any) => {
//   await channel.assertExchange(process.env.EXCHANGE_NAME!, "direct", {
//     durable: true,
//   });
//   const q = await channel.assertQueue("", { exclusive: true });
//   console.log(` Waiting for messages in queue: ${q.queue}`);

//   channel.bindQueue(
//     q.queue,
//     process.env.EXCHANGE_NAME,
//     process.env.OTP_BINDING_KEY
//   );

//   channel.consume(
//     q.queue,
//     (msg: Message | null) => {
//       if (msg) {
//         console.log("the message is:", msg.content.toString());
//         service(msg.content.toString());
//       }
//       console.log("otp data received");
//     },
//     {
//       noAck: false,
//     }
//   );
// };

// const requestData = async (
//   RPC_QUEUE_NAME: string,
//   requestPayload: any,
//   uuid: any
// ) => {
//   try {
//     const channel = await getChannel();

//     const q = await channel.assertQueue("", { exclusive: true });

//     channel.sendToQueue(
//       RPC_QUEUE_NAME,
//       Buffer.from(JSON.stringify(requestPayload)),
//       {
//         replyTo: q.queue,
//         correlationId: uuid,
//       }
//     );

//     return new Promise((resolve, reject) => {
//       // timeout n
//       const timeout = setTimeout(() => {
//         channel.close();
//         resolve("API could not fullfil the request!");
//       }, 8000);
//       channel.consume(
//         q.queue,
//         (msg: any) => {
//           if (msg.properties.correlationId == uuid) {
//             resolve(JSON.parse(msg.content.toString()));
//             clearTimeout(timeout);
//           } else {
//             reject("data Not found!");
//           }
//         },
//         {
//           noAck: true,
//         }
//       );
//     });
//   } catch (error) {
//     console.log(error);
//     return "error";
//   }
// };

// export const RPCRequest = async (
//   RPC_QUEUE_NAME: string,
//   requestPayload: any
// ) => {
//   const uuid = uuid4(); // correlationId
//   return await requestData(RPC_QUEUE_NAME, requestPayload, uuid);
// };

// export const RPCObserver = async (RPC_QUEUE_NAME: string, service: any) => {
//   const channel = await getChannel();
//   await channel.assertQueue(RPC_QUEUE_NAME, {
//     durable: false,
//   });
//   channel.prefetch(1);
//   channel.consume(
//     RPC_QUEUE_NAME,
//     async (msg: any) => {
//       if (msg.content) {
//         // DB Operation
//         const payload = JSON.parse(msg.content.toString());
//         const response = await service(payload);
//         channel.sendToQueue(
//           msg.properties.replyTo,
//           Buffer.from(JSON.stringify(response)),
//           {
//             correlationId: msg.properties.correlationId,
//           }
//         );
//         channel.ack(msg);
//       }
//     },
//     {
//       noAck: false,
//     }
//   );
// };
