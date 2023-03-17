import { Schema, model, Types } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateOTP } from "@sfroads/common";
import { IUser } from "../utils/types";

const UserSchema = new Schema<IUser>({
  fullName: {
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
  password: {
    type: String,
    minlength: 6,
  },
  NIN: {
    type: String,
  },
  plateNumber: {
    type: String,
  },
  WIP: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  state: {
    type: String,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ["Pending", "Active"],
    default: "Pending",
  },
  isSignup: {
    type: Boolean,
    default: false,
  },
  userType: [
    {
      type: String,
      enum: ["Civilian", "Offender", "Officer", "Lawyer"],
      default: "Civilian",
    },
  ],
  ticket: [
    {
      _id: {
        type: Schema.Types.ObjectId,
        require: true,
      },
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
      createdAt: Date,
      updatedAt: Date,
    },
  ],
  confirmationCode: {
    type: String,
  },
  passwordResetExpires: { type: Date, default: null },
  profileIconUrl: {
    type: String,
    required: false,
    maxlength: 255,
    default: null,
  },
  profileIconCloudinaryId: {
    type: String,
    required: false,
    maxlength: 255,
    default: null,
  },
});

UserSchema.methods.createJWT = function () {
  return jwt.sign(
    {
      userId: this._id,
      name: this.name,
      email: this.email,
      status: this.status,
    },
    (process.env.JWT_SECRET as string) || "",
    {
      expiresIn: "30d",
    }
  );
};

UserSchema.methods.comparePassword = async function (
  canditatePassword: string
) {
  const isMatch = await bcrypt.compare(canditatePassword, this.password);
  return isMatch;
};

UserSchema.methods.createPasswordResetToken = function () {
  const otp = generateOTP(4);
  this.otp = otp;
  return otp;
};

export default model("User", UserSchema);
