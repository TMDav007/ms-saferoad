import { Stan } from "node-nats-streaming";
import { Subjects } from "./subjects";

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Publisher<T extends Event> {
  abstract subject: T["subject"];
  private clientsdsdsd: Stan;

  constructor(clientsdsdsd: Stan) {
    this.clientsdsdsd = clientsdsdsd;
  }

  publish(subject: T["subject"], data: T["data"]): Promise<void> {
    return new Promise((resolve, reject) => {
      this.clientsdsdsd.publish(subject, JSON.stringify(data), (err) => {
        if (err) {
          return reject(err);
        }
        console.log("Event published to subject", this.subject);
        resolve();
      });
    });
  }
}
