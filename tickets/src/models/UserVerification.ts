import { Schema, model, connect } from "mongoose";
import { IAccountVerify } from "../utils/types";

const UserVerificationSchema = new Schema<IAccountVerify>({
    userId: String,
    otp: String,
    createdAt: Date,
    expiresAt: Date, 
})


export default model("UserVerification", UserVerificationSchema);