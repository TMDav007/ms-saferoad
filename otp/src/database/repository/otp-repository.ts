import OTP from "../models/otp";
import { IOTP } from "../../utils/types";
import { AppError, decryptPass, generateOTP } from "@sfroads/common";

export default class OTPRepository {
  async createOtp(
    userId: string,
    email?: string,
    phoneNumber?: string,
    otp?: string
  ) {
    try {
      let gotp = otp ? otp : await generateOTP(6);

      const newOtp = new OTP({
        userId,
        otp: gotp,
        email: email,
      });

      const data = await newOtp.save();

      return { data, gotp };
    } catch (err: any) {
      throw new AppError(500, err.message);
    }
  }

  async UserOtp(userId: string) {
    const userOtp = (await OTP.findOne({ userId: userId }).sort({
      createdAt: -1,
    })) as IOTP;

    if (userOtp) return userOtp;
    return "";
  }

  async resendOtp(email: string, phoneNumber?: string) {
    try {
      const newOtp = generateOTP(6);

      const variableForUpdate = email
        ? { userId: email }
        : { phoneNumber: phoneNumber };

      const otpResult = await OTP.findOneAndUpdate(
        variableForUpdate,
        {
          otp: newOtp,
          expiresAt: new Date(Date.now() + 15 * 60 * 1000),
        },
        { new: true }
      );
      return newOtp;
    } catch (err: any) {
      throw new AppError(500, err.message);
    }
  }

  async verifyOtp(userId: string, otp: string) {
    try {
      const userOtps = (await OTP.find({ userId: userId })) as [IOTP];

      const userOtp = userOtps[userOtps.length - 1] as IOTP;

      if (!userOtp) return "empty";
      const isOTPValid = otp.toString() === userOtp.otp! ? true : false;
      if (!isOTPValid) {
        return "invalid";
      }
      if (userOtp.expiresAt! < Date.now()) {
        return "expired";
      }
      return isOTPValid;
    } catch (err: any) {
      throw new AppError(500, err.message);
    }
  }

  async DeleteOtp(id: string) {
    await OTP.findByIdAndDelete(id);

    return;
  }
}

async function resent(email?: string, phoneNumber?: string) {}

function msToTime(ms: number) {
  let minutes = (ms / (1000 * 60)).toFixed(1);

  return minutes;
}
