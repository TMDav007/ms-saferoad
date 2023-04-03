import Joi from "joi";
import { ITicket } from "./types";

const validateTicketData = (Ticket: ITicket) => {
  const TicketSchema = Joi.object({
    offenderIDNumber: Joi.string().required().messages({
      "string.base": "offenderIDNumber must be a string",
      "any.required": "offenderIDNumber is required",
    }),
    offenderFullName: Joi.string().required().messages({
      "string.base": "offenderFullName must be a string",
      "any.required": "offenderFullName is required",
    }),
    location: Joi.string().required().messages({
      "string.base": "location must be a string",
      "any.required": "location is required",
    }),
    offense: Joi.string().required().messages({
      "string.base": "offense must be a string",
      "any.required": "offense is required",
    }),
    price: Joi.required().messages({
      "any.required": "price is required",
    }),
    offenderPhoneNumber: Joi.string().messages({
      "string.base": "offenderPhoneNumber must be a string",
    }),
    offenderEmail: Joi.string().messages({
      "string.base": "offenderEmail must be a string",
    }),
    carModel: Joi.string().required().messages({
      "string.base": "carModel must be a string",
      "any.required": "carModel is required",
    }),
    carType: Joi.string().required().messages({
      "string.base": "carType must be a string",
      "any.required": "carType is required",
    }),
    plateNumber: Joi.string().required().messages({
      "string.base": "plateNumber must be a string",
      "any.required": "plateNumber is required",
    }),
  })
    .xor("offenderEmail", "offenderPhoneNumber")
    .messages({
      "object.missing": "You must add the required input fields",
      "object.xor": "offenderEmail or offenderPhoneNumber is required",
      "object.unknown": "Value inputted is unknown",
    });
  return TicketSchema.validate(Ticket);
};

export { validateTicketData };
