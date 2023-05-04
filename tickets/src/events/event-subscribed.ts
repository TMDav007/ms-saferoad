import { AppError } from "@sfroads/common";
import Ticket from "../models/Ticket";

export const handlePayment = async (data: any) => {
  const { ticketId } = data;

await Ticket.findByIdAndUpdate(
    { _id: ticketId },
    {
      status: "Paid",
    },
    { new: true, useFindAndModify: false }
  );


};
