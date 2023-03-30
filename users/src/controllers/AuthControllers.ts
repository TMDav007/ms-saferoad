import User from "../models/User";
import { smsOtp, GenerateSignature, Authenticate } from "../library/smsOtp";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { getPoliceDetails, policeData } from "../data/policeDummyData";
import { getOffendersDetails } from "../data/NINDummyData";
import {
  validateAccountVerify,
  validateSignupData,
} from "../utils/validations";
import sendVerificationMail from "../library/verificationEmail";
// import { createToken } from "../library/create_token";
import UserVerification from "../models/UserVerification";
import {
  decryptPass,
  AppError,
  generateOTP,
  encryptPassword,
  createToken
} from "@sfroads/common";

const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let user: any;
    let otp = generateOTP(4);
    let { WID, NIN, fullName, email, phoneNumber, password } = req.body;
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
    const existingWID =
      WID &&
      (await User.findOne({
        WID,
      }));
    const existingNIN = NIN && (await User.findOne({ NIN }));
    if (existingEmail || existingPhoneNumber || existingNIN || existingWID) {
      throw new AppError(StatusCodes.CONFLICT, "User already exists");
      // await User.findByIdAndDelete(existingEmail.id);
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
    user.password = await encryptPassword(user.password);

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
    console.log(user);
    await user.save();
    // await user.populate({
    //   path: "userType",
    //   model: "UserTypeSchema",
    // });

    // //Generate JWT
    // const userJwt = jwt.sign(
    //   {
    //     id: user._id,
    //     email: user.email,
    //     phone: user.phoneNumber,
    //   },
    //   process.env.JWT_KEY!
    // );

    // Store it on session object
    // req.session!["jwt"] = userJwt;
    // console.log(req);
    return res.status(StatusCodes.CREATED).json({
      message:
        "Signup was successful. Kindly check your email to activate your account",
      success: true,
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
        verified: user?.verified,
        userType: user?.userType,
        idNum: user?.NIN || user?.WID,
      },
      process.env.JWT_KEY!
    );
    const token = createToken(user);

    // Store it on session object
    req.session!["jwt"] = userJwt;

    return res.status(StatusCodes.OK).json({
      message: "Account verified successfully",
      success: true,
      token,
    });
  } catch (error) {
    next(error);
  }
};

const signIn = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let { NIN, WID, PASSWORD } = req.body;
    let user;
    if (NIN) {
      user = NIN && (await User.findOne({ NIN }));
    }
    if (WID && PASSWORD) {
      user = NIN && (await User.findOne({ WID }));
    }
    console.log(user)
    //Generate JWT
    const userJwt = jwt.sign(
      {
        id: user?._id,
        email: user?.email,
        verified: user?.verified,
        userType: user?.userType,
        idNum: user?.NIN || user?.WID,
      },
      process.env.JWT_KEY!
    );

    const token = createToken(user);
    return res.status(StatusCodes.OK).json({
      message: "Signin successfully",
      success: true,
      token,
    });
  } catch (error) {
    next(error);
  }
};

const signout = async (req: Request, res: Response, next: NextFunction) => {
  req.session = null;
  res.send({});
};
export { signup, verifyAccount, signout, resendOtp, signIn };
