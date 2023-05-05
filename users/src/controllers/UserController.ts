import User from "../models/User";
import { StatusCodes } from "http-status-codes";
import { NextFunction, Request, Response } from "express";
import { validateAddInfo } from "../utils/validations";
import { AppError } from "@sfroads/common";
//import { producer } from "../server";

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const allUsers = await User.find();
    return res.status(StatusCodes.OK).json({
      message: "Request was successfully",
      success: true,
      data: allUsers,
    });
  } catch (err) {
    next(err);
  }
};

const getCurrentUser = async (req: any, res: Response, next: NextFunction) => {
  const msg = {
    action: "LOGIN",
    data: req?.user,
  };
  // producer(JSON.stringify(msg));
  const {
    _id,
    fullName,
    email,
    phoneNumber,
    NIN,
    WID,
    plateNumber,
    driverLicense,
    userType,
  } = (await User.findById({ _id: req.user.userId })) as any;

  return res.status(StatusCodes.OK).json({
    message: "Request was successfully",
    success: true,
    data: {
      id: _id,
      fullName,
      email,
      phoneNumber,
      NIN,
      WID,
      plateNumber,
      driverLicense,
      userType,
    },
  });
};

const addUserInfo = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { driverLicense, carModel, plateNumber } = req.body;

    const valid: any = validateAddInfo(req.body);

    if (valid.error) {
      throw new AppError(StatusCodes.BAD_REQUEST, valid.error.message);
    }
    //driver license needs to be confirmed
    //confirmDriverLicence()

    await User.findByIdAndUpdate(
      { _id: req.user.userId },
      {
        driverLicense,
        carModel,
        plateNumber,
      },
      { new: true, useFindAndModify: false }
    );

    return res.status(StatusCodes.OK).json({
      message: "Request was successfully",
      success: true,
      data: null,
    });
  } catch (err) {
    next(err);
  }
};

export { getAllUsers, getCurrentUser, addUserInfo };
