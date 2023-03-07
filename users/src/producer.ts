import amqp, { Connection } from "amqplib/callback_api";

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
    console.log(ch, "ch")
    console.log("Producer message to RabbitMQ...", ch);
    ch.sendToQueue(queueName, Buffer.from(msg));
  };
};

export default createMQProducer;
