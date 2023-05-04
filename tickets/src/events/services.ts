import { handlePayment } from "./event-subscribed";
import { Subjects } from "./subjects";

export const SubscribeEvents = (payload: any) => {
  console.log("Triggering Ticket services");

  payload = JSON.parse(payload);
  const { action, data } = payload;
  switch (action) {
    case Subjects.PaymentSuccess:
      handlePayment(data);

      break;
    default:
      break;
  }
};
