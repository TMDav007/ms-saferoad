import User from "../models/User";
import { generateOTP } from "./../library/generateOTP";
import { smsOtp, GenerateSignature, Authenticate } from "../library/smsOtp";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { getPoliceDetails, policeData } from "../data/policeDummyData";
import { getOffendersDetails } from "../data/NINDummyData";
import { AppError } from "@sfroads/common";
import {
  validateAccountVerify,
  validateSignupData,
} from "../utils/validations";
import sendVerificationMail from "../library/verificationEmail";
import UserVerification from "../models/UserVerification";
import { decryptPass } from "@sfroads/common";

const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let user: any;
    let otp = generateOTP(4);
    let { WIP, NIN, fullName, email, phoneNumber, password } = req.body;

    const valid: any = validateSignupData(req.body);
    if (valid.error) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "User's details provided are invalid."
      );
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
    const existingWIP =
      WIP &&
      (await User.findOne({
        WIP,
      }));
    const existingNIN = NIN && (await User.findOne({ NIN }));
    if (existingEmail || existingPhoneNumber || existingNIN || existingWIP) {
      // throw new AppError(StatusCodes.CONFLICT, "User already exists");
      await User.findByIdAndDelete(existingEmail.id);
    }

    console.log(existingPhoneNumber, "phoneNumber");

    if (!WIP && !NIN) {
      user = new User({
        fullName,
        phoneNumber,
        otp,
        email,
        isSignup: true,
      });
    }
    if (WIP) {
      const { fullName, phoneNumber, state, error } = getPoliceDetails(WIP);
      if (error) {
        throw new AppError(StatusCodes.NOT_FOUND, error as string);
      }
      user = new User({
        fullName,
        phoneNumber,
        state,
        WIP,
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
        userType: "Offender",
        password,
        plateNumber,
        NIN,
      });
    }
    //user.password = await encryptPassword(user.password);

    let signature = "";
    if (email) {
      email &&
        (await sendVerificationMail(
          { _id: user._id, email: user.email },
          res,
          next
        ));
    }

    if (phoneNumber) {
      phoneNumber && (await smsOtp(otp, user));
      signature = GenerateSignature({
        otp,
        phoneNumber,
        userId: user._id,
        verified: user.verified,
      });
    }

    await user.save();
    // await user.populate({
    //   path: "userType",
    //   model: "UserTypeSchema",
    // });

    //Generate JWT
    const userJwt = jwt.sign(
      {
        id: user._id,
        email: user.email,
        phone: user.phoneNumber,
      },
      process.env.JWT_KEY!
    );

    // Store it on session object
    req.session!["jwt"] = userJwt;

    return res.status(StatusCodes.CREATED).json({
      message:
        "Signup was successful. Kindly check your email to activate your account",
      success: true,
      signature,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const resendOtp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let { email } = req.body;

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

    await sendVerificationMail(
      { _id: existingEmail._id, email: existingEmail.email },
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
};

const verifyAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let { otp, userId } = req.body;
    const valid = validateAccountVerify(req.body);
    if (valid.error) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "Account verification details provided are invalid."
      );
    }
    const isUserVerify: any = await UserVerification.find({ userId });

    if (isUserVerify.length < 1) {
      throw new AppError(
        StatusCodes.NOT_FOUND,
        "Account does not exist or not verify"
      );
    }

    if (isUserVerify.expiresAt < Date.now()) {
      await UserVerification.deleteOne({ userId });
      throw new AppError(
        StatusCodes.GONE,
        "Code has expired, please signup again"
      );
    }

    const isOTPValid = await decryptPass(
      otp.toString(),
      isUserVerify[isUserVerify.length - 1].otp
    );
    if (!isOTPValid) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "OTP is invalid, Please enter a valid OTP"
      );
    }

    await UserVerification.deleteOne({ userId });
    const user: any = await User.findByIdAndUpdate(
      { _id: userId },
      { verified: true, status: "Active" },
      {
        new: true,
        runValidators: true,
      }
    );

    //Generate JWT
    const userJwt = jwt.sign(
      {
        id: user?._id,
        email: user?.email,
        verified: user.verified,
        userType: user.userType[0].userType,
      },
      process.env.JWT_KEY!
    );

    // Store it on session object
    req.session!["jwt"] = userJwt;

    return res.status(StatusCodes.OK).json({
      message: "Account verified successfully",
      success: true,

      data: null,
    });
  } catch (error) {
    next(error);
  }
};

const signout = async (req: Request, res: Response, next: NextFunction) => {
  req.session = null;
  res.send({});
};
export { signup, verifyAccount, signout, resendOtp };
