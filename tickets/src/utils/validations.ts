import Joi from "joi";
import { ITicket } from "./types";

const validateTicketData = (Ticket: ITicket) => {
	const TicketSchema = Joi.object({
		offenderIDNumber: Joi.string().required(),
		offenderName: Joi.string().required(),
		officerID: Joi.string().required(),
		offenderPhoneNumber: Joi.string().required(),
		carModel: Joi.string().required(),
		carType: Joi.string().required(),
		evidenceUrl: Joi.string(),
		evidenceCloudinaryId:Joi.string(),
		status: Joi.string().required(),
	})
	return TicketSchema.validate(Ticket);
};


export { validateTicketData };
