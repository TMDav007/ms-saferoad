import { Schema, model } from "mongoose";
import { ITicket } from "../utils/types";

const TicketSchema = new Schema<ITicket>({
  offenderIDNumber: {
    type: String,
    required: true,
  },
  offenderFullName: {
    type: String,
  },
  location: {
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
  offenderEmail: {
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
  gracePeriod: {
    type: String,
  },
  status: {
    type: String,
    enum: ["Pending", "Paid"],
    default: "Pending",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
});

export default model("Ticket", TicketSchema);
