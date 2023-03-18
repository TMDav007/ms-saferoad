import { Schema, model, Types } from "mongoose";
import { IUserTypes } from "../utils/types";

const UserType = new Schema<IUserTypes>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Please provide user"],
  },
  userType: {
    type: String,
    enum: ["Civilian", "Offender", "Officer", "Lawyer"],
    default: "Civilian",
  },
  createdAt: Date,
});

export default model("UserTypeSchema", UserType);
