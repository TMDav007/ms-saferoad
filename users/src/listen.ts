import nats, { Message } from "node-nats-streaming";
import { MongoClient } from "mongodb";

const start = async () => {
  const stan = nats.connect(
    'ticketing',
    '5',
    {
      url: 'http://localhost:4222',
    }
  );

  stan.on("connect", () => {
    console.log(
      "Statistic Service is connected to NATS Streaming Server \nWaiting for Events ..."
    );

    stan.on("close", () => {
      console.log("Nats connection closed!");
      process.exit();
    });

    const options = stan
      .subscriptionOptions()
      .setDeliverAllAvailable()
      .setManualAckMode(true)

    const subscription = stan.subscribe(
      "test", options
    );

    subscription.on("message", async (msg: Message) => {
      const parsedData = JSON.parse(msg.getData().toString("utf-8"));
      console.log("EVENT RECEIVED WITH THE DATA BELOW :");
      console.table(parsedData);

      msg.ack();
    });
  });
};

start();
