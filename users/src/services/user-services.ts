import { SubscribeMessage } from "../consumer";
//import { consumer } from "../server";
import { handleTicketCreated } from "./event-subscribed";


const SubscribeEvents = (payload: any) => {
  const { event, data } = payload;
  switch (event) {
    case "Ticket:Created":
      handleTicketCreated(data);
    case "Test":
      console.log("Working ....SUbscrber");
    default: break;
  }
};

//console.log(consumer)

