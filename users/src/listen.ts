import nats, {  } from "node-nats-streaming";
import { MongoClient } from "mongodb";

import { AppError } from "@sfroads/common";
import amqp, { Message, Channel } from "amqplib/callback_api";
import amqplib from "amqplib";

class MQWrapper {
  private _client?: Channel;

  get client() {
    if (!this._client) {
      throw new Error("Cannot access MQ client before connecting");
    }
    return this._client;
  }

  async connect(URL: string, EXCHANGE_NAME: string) {
    const connection = await amqplib.connect(URL);
    this._client = await connection.createChannel();

    this._client.assertExchange(EXCHANGE_NAME, "direct", {
      durable: true,
    });
    console.log("Connected to MQ");
  }
}

export const mqWrapper = new MQWrapper();

export abstract class Publisher {
  private client: Channel;

  constructor(client: Channel) {
    this.client = client;
  }

  publish(
    channel: string,
    EXCHANGE_NAME: string,
    binding_key: string,
    message: any
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.client.publish(EXCHANGE_NAME, binding_key, Buffer.from(message));
        resolve();
      } catch (err) {
        return reject(err);
      }
    });
  }
}

export abstract class Consumer {
  private client: any;

  constructor(client: any) {
    this.client = client;
  }

  async listen(exchange_name: string, binding_key: string, service: any) {
    const q = await this.client.assertQueue("", { exclusive: true });
    this.client.bindQueue(q.queue, exchange_name, binding_key);

    this.client.consume(
      q.queue,
      (msg: Message | null) => {
        if (msg) {
          console.log("recieved data");
          console.log(msg?.content.toString());
          service(msg.content.toString());
          this.client.ack(msg);
        }
      },
      { noAck: false }
    );
  }
}

// const start = async () => {
//   const stan = nats.connect(
//     'ticketing',
//     '5',
//     {
//       url: 'http://localhost:4222',
//     }
//   );

//   stan.on("connect", () => {
//     console.log(
//       "Statistic Service is connected to NATS Streaming Server \nWaiting for Events ..."
//     );

//     stan.on("close", () => {
//       console.log("Nats connection closed!");
//       process.exit();
//     });

//     const options = stan
//       .subscriptionOptions()
//       .setDeliverAllAvailable()
//       .setManualAckMode(true)

//     const subscription = stan.subscribe(
//       "test", options
//     );

//     subscription.on("message", async (msg: Message) => {
//       const parsedData = JSON.parse(msg.getData().toString("utf-8"));
//       console.log("EVENT RECEIVED WITH THE DATA BELOW :");
//       console.table(parsedData);

//       msg.ack();
//     });
//   });
// };

// start();
