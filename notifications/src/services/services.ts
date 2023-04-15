import { handleTicketCreated } from "./event-subscribed";
import { Subjects } from "./subject";

export const SubscribeEvents = (payload: any) => {
  console.log("Triggering Notification services");

  payload = JSON.parse(payload);
  const { action, data } = payload;
  switch (action) {
    case Subjects.TicketCreated:
      handleTicketCreated(data);
      break;
    default:
      break;
  }
};
