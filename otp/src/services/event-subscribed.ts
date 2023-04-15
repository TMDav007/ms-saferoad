import OTPRepository from "../database/repository/otp-repository";

import { AppError } from "@sfroads/common";

const otps = new OTPRepository();
export const handleOTPRequest = async (data: any) => {
  const { id, email } = data;
  const { gotp } = await otps.createOtp(id, email);
  return gotp;
};

export const handleOTPResend = async (data: any) => {
  const gotp = await otps.resendOtp(data);
  return gotp;
};

export const handleOTPVerify = async (data: any) => {
  const { userId, otp } = data;
  const gotp = await otps.verifyOtp(userId, otp);
  return gotp;
};
