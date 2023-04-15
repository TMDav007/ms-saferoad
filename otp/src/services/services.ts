import {
  handleOTPRequest,
  handleOTPResend,
  handleOTPVerify,
} from "./event-subscribed";
import { Subjects } from "./subject";

export const SubscribeEvents = (payload: any) => {
  console.log("Triggering OTP services");

  payload = JSON.parse(payload);
  const { action, data } = payload;

  switch (action) {
    case Subjects.OTPRequested:
      handleOTPRequest(data);
  }
};

export const RPCResponse = async (payload: any) => {
  console.log("Triggering OTP RPC");

  // payload = JSON.parse(payload);
  const { action, data } = payload;

  console.log(payload);
  switch (action) {
    case Subjects.OTPRequested:
      return await handleOTPRequest(data);

    case Subjects.OTPResend:
      return await handleOTPResend(data);

    case Subjects.OTPVerify:
      return await handleOTPVerify(data);

    default:
      break;
  }
};
