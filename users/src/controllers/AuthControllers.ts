import User from "../models/User";
import { smsOtp, GenerateSignature, Authenticate } from "../library/smsOtp";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { getPoliceDetails } from "../data/policeDummyData";
import { getOffendersDetails } from "../data/NINDummyData";
import {
  validateAccountVerify,
  validateOTP,
  validateSignin,
  validateSignupData,
} from "../utils/validations";
import sendVerificationMail from "../library/verificationEmail";

import {
  decryptPass,
  AppError,
  generateOTP,
  encryptPassword,
  createToken,
} from "@sfroads/common";
import { RPCRequest } from "../consumer";

export default class AuthController {
  async signup(req: Request, res: Response, next: NextFunction) {
    try {
      let user: any;
      let otp = generateOTP(4);
      let { WID, NIN, fullName, email, phoneNumber, password } = req.body;
      const valid: any = validateSignupData(req.body);
      if (valid.error) {
        throw new AppError(StatusCodes.BAD_REQUEST, valid.error.message);
      }
      email = email?.toLowerCase();
      const existingEmail =
        email &&
        (await User.findOne({
          email: email,
        }));
      const existingPhoneNumber =
        phoneNumber &&
        (await User.findOne({
          phoneNumber: phoneNumber,
        }));
      const existingWID =
        WID &&
        (await User.findOne({
          WID,
        }));
      const existingNIN = NIN && (await User.findOne({ NIN }));
      if (existingEmail || existingPhoneNumber || existingNIN || existingWID) {
        //throw new AppError(StatusCodes.CONFLICT, "User already exists");
        await User.findByIdAndDelete(existingEmail.id);
      }

      if (!WID && !NIN) {
        user = new User({
          fullName,
          phoneNumber,
          otp,
          email,
          isSignup: true,
        });
      }

      if (WID) {
        const { fullName, phoneNumber, state, error } = getPoliceDetails(WID);
        if (error) {
          throw new AppError(StatusCodes.NOT_FOUND, error as string);
        }
        user = new User({
          fullName,
          phoneNumber,
          email,
          state,
          WID,
          isSignup: true,
          password,
          userType: "Officer",
        });
      }

      if (NIN) {
        const { fullName, email, phoneNumber, plateNumber, error } =
          getOffendersDetails(NIN);
        if (error) {
          throw new AppError(StatusCodes.NOT_FOUND, error as string);
        }
        user = new User({
          fullName,
          phoneNumber,
          email,
          isSignup: true,
          userType: "Offender",
          password,
          plateNumber,
          NIN,
        });
      }
      user?.password && (await encryptPassword(user.password));
      const otpResponse = (await RPCRequest("OTP_RPC", {
        action: "otp:request",
        data: { id: user._id, email: user.email },
      })) as string;
      let signature = "";

      if (email) {
        email &&
          (await sendVerificationMail(
            { _id: user._id, email: user.email, otp: otpResponse },
            res,
            next
          ));
      }

      if (phoneNumber) {
        phoneNumber && (await smsOtp(parseInt(otpResponse), user));
        signature = GenerateSignature({
          otp,
          phoneNumber,
          userId: user._id,
          verified: user.verified,
        });
      }
      await user.save();

      return res.status(StatusCodes.CREATED).json({
        message:
          "Signup was successful. Kindly check your email to activate your account",
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async resendOtp(req: Request, res: Response, next: NextFunction) {
    try {
      let { email } = req.body;
      const valid = validateOTP(req.body);
      if (valid.error) {
        throw new AppError(StatusCodes.BAD_REQUEST, valid.error.message);
      }

      email = email?.toLowerCase();
      const existingEmail =
        email &&
        (await User.findOne({
          email: email,
        }));

      if (!existingEmail) {
        throw new AppError(StatusCodes.BAD_REQUEST, "User does not exist");
      }

      if (existingEmail.verified) {
        throw new AppError(StatusCodes.BAD_REQUEST, "User has been verified");
      }
      const otpResponse = (await RPCRequest("OTP_RPC", {
        action: "otp:resend",
        data: existingEmail?._id,
      })) as string;

      await sendVerificationMail(
        {
          _id: existingEmail._id,
          email: existingEmail.email,
          otp: otpResponse,
        },
        res,
        next
      );

      return res.status(StatusCodes.CREATED).json({
        message: "OTP resent. Kindly check your email to activate your account",
        success: true,
        data: null,
      });
    } catch (error) {
      next(error);
    }
  }

  async verifyAccount(req: Request, res: Response, next: NextFunction) {
    try {
      let { otp, userId } = req.body;
      const valid = validateAccountVerify(req.body);
      if (valid.error) {
        throw new AppError(StatusCodes.BAD_REQUEST, valid.error.message);
      }

      // if (isUserVerify.expiresAt < Date.now()) {
      //   await UserVerification.deleteOne({ userId });

      const otpResponse = (await RPCRequest("OTP_RPC", {
        action: "otp:verify",
        data: { otp, userId },
      })) as string;
      // console.log(otpResponse);

      let token;

      switch (otpResponse) {
        case "empty":
          throw new AppError(
            StatusCodes.NOT_FOUND,
            "Account does not exist or not verify"
          );
        case "invalid":
          throw new AppError(
            StatusCodes.BAD_REQUEST,
            "OTP is invalid, Please enter a valid OTP"
          );
        case "expired":
          throw new AppError(
            StatusCodes.GONE,
            "Code has expired, please signup again"
          );

        default:
          const user: any = await User.findByIdAndUpdate(
            { _id: userId },
            { verified: true, status: "Active" },
            {
              new: true,
              runValidators: true,
            }
          );
          token = createToken(user);
      }

      return res.status(StatusCodes.OK).json({
        message: "Account verified successfully",
        success: true,
        token,
      });
    } catch (error) {
      next(error);
    }
  }

  async signIn(req: Request, res: Response, next: NextFunction) {
    try {
      let { NIN, WID, password } = req.body;
      let user;

      const valid: any = validateSignin(req.body);

      if (valid.error) {
        throw new AppError(StatusCodes.BAD_REQUEST, valid.error.message);
      }
      if (NIN) {
        user = NIN && (await User.findOne({ NIN }));
      }
      if (WID && password) {
        user = WID && (await User.findOne({ WID }));
      }
      if (!user) throw new AppError(StatusCodes.NOT_FOUND, "User not found");
      if (!NIN) {
        if (!user.password)
          throw new AppError(
            StatusCodes.BAD_REQUEST,
            "Password is needed to continue!!!"
          );
        if (user.password) {
          const isPasswordMatch = await decryptPass(password, user.password);
          if (!isPasswordMatch)
            throw new AppError(
              StatusCodes.BAD_REQUEST,
              "password is incorrect"
            );
        }
      }

      const token = createToken(user);
      return res.status(StatusCodes.OK).json({
        message: "Sign in was successful",
        success: true,
        token,
      });
    } catch (error) {
      next(error);
    }
  }
}
