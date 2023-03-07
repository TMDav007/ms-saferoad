import { Schema, model } from "mongoose";
import { ITicket } from "../utils/types";

const TicketSchema = new Schema<ITicket>({
  offenderIDNumber: {
    type: String,
    required: true,
  },
  offenderName: {
    type: String,
    required: true,
  },
  createdBy: {
    type: String,
    required: true,
  },
  plateNumber: {
    type: String,
    required: true,
  },
  offense: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  carType: {
    type: String,
    required: true,
  },
  carModel: {
    type: String,
    required: true,
  },
  offenderPhoneNumber: {
    type: String,
  },
  evidenceUrl: {
    type: String,
    required: false,
    maxlength: 255,
    default: null,
  },
  evidenceCloudinaryId: {
    type: String,
    required: false,
    maxlength: 255,
    default: null,
  },
  status: {
    type: String,
    enum: ["Unpaid", "Paid"],
    default: "Unpaid",
  },
  createdAt: { type: Date },
  updatedAt: { type: Date },
});

export default model("Ticket", TicketSchema);
