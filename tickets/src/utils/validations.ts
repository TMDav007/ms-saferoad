import Joi from "joi";
import { ITicket } from "./types";

const validateTicketData = (Ticket: ITicket) => {
  const TicketSchema = Joi.object({
    offenderIDNumber: Joi.string().required(),
    offenderFullName: Joi.string().required(),
    location: Joi.string().required(),
    offense: Joi.string().required(),
    price: Joi.required(),
    offenderPhoneNumber: Joi.string(),
    offenderEmail: Joi.string(),
    carModel: Joi.string().required(),
    carType: Joi.string().required(),
	plateNumber: Joi.string().required(),
  }).xor("offenderEmail", "offenderPhoneNumber");
  return TicketSchema.validate(Ticket);
};

export { validateTicketData };
