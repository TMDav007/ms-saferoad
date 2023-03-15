import { SubscribeMessage } from "../consumer";
//import { consumer } from "../server";
import { handleTicketCreated } from "./event-subscribed";

export const SubscribeEvents = (payload: any) => {
  console.log("Triggering.... Customer Events");

  payload = JSON.parse(payload);
  const { action, data } = payload;
  console.log(payload, data, action, "payLoad");

  switch (action) {
    case "Ticket:Created":
      handleTicketCreated(data);
      break;
    case "Test":
      console.log("Working ....SUbscrber");
      break;
    default:
      break;
  }
};

//console.log(consumer)
