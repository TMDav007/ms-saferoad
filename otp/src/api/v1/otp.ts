import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import OTPRepository from "../../database/repository/otp-repository";
import { IOTP } from "../../utils/types";
import { AppError, auth, decryptPass } from "@sfroads/common";
import bcrypt from "bcryptjs";
import { RPCObserver } from "../../services/messageBroker";
import { RPCResponse } from "../../services/services";

const otps = new OTPRepository();

export default (app: any, channel: any) => {
  RPCObserver("OTP_RPC", RPCResponse);
  app.get("/api/v1/otp", (_req: Request, res: Response) => {
    return res.status(200).json({
      message: "Welcome to safe road OTP SERVICE entry point",
    });
  });

  app.post(
    "/api/v1/otp",
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { userId, otp }: IOTP = req.body;

        const { data } = await otps.createOtp(userId, otp);

        return res.status(StatusCodes.CREATED).json({
          message: "OTP created successfully",
          success: true,
          data,
        });
      } catch (err) {
        next(err);
      }
    }
  );

  app.post(
    "/api/v1/otp/verify",
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { userId, otp } = req.body;
        const retrivedOtp = await otps.UserOtp(userId);
        if (!retrivedOtp) {
          throw new AppError(StatusCodes.NOT_FOUND, "OTP not found");
        }

        if (retrivedOtp.expiresAt! < Date.now()) {
          throw new AppError(
            StatusCodes.BAD_REQUEST,
            "OTP Code has expired, please resend Otp request"
          );
        }

        const isValid = await decryptPass(otp, retrivedOtp.otp!);

        if (!isValid) {
          throw new AppError(
            StatusCodes.BAD_REQUEST,
            "OTP is invalid, Please enter a valid OTP"
          );
        }

        return res.status(StatusCodes.OK).json({
          message: "OTP verified successfully",
          success: true,
          data: retrivedOtp,
        });
      } catch (err) {
        next(err);
      }
    }
  );
};
