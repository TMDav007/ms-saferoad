import { handleCreateNotification } from "./event-subscribed";
import { Subjects } from "./subject";

export const SubscribeEvents = (payload: any) => {
  console.log("Triggering Notification services");

  payload = JSON.parse(payload);
  const { action, data } = payload;
  switch (action) {
    case Subjects.TicketCreated:
        handleCreateNotification(data);
    case Subjects.PaymentSuccess:
        handleCreateNotification(data);
    
      break;
    default:
      break;
  }
};
