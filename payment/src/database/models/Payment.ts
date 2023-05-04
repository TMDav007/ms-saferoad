import { Schema, model } from "mongoose";
import { IPayment } from "../../utils/types";

const PaymentSchema = new Schema<IPayment>(
  {
    status: {
      type: "string",
      enum: ["success", "failed"],
      required: true,
    },
    userId: {
      type: "string",
      required: true,
    },
    ticketId: {
      type: "string",
      required: true,
    },
    gatewayReferenceId: {
      type: "string",
      required: false,
    },
    gatewayName: {
      type: "string",
      default: "Paystack",
      required: false,
    },
    amount: {
      type: "number",
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

export default model("Payment", PaymentSchema);
