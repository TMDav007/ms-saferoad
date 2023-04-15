import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import { IOTP } from "../../utils/types";

const otpSchema = new Schema<IOTP>(
  {
    userId: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
    },
    email: {
      type: String,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please provide a valid email",
      ],
      unique: true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    expiresAt: {
      type: Date,
      default: new Date(Date.now() + (15 * 60 * 1000)),
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

otpSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.otp = await bcrypt.hash(this.otp!, salt);
});

export default model("OTP", otpSchema);
