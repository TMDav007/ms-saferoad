import User from "../models/User";
import { StatusCodes } from "http-status-codes";
import { NextFunction, Request, Response } from "express";
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

const getCurrentUser = (req: Request, res: Response, next: NextFunction) => {
  const msg = {
    action: "LOGIN",
    data: req?.currentUser,
  };
  // producer(JSON.stringify(msg));
  return res.send({ currentUser: req?.currentUser || null });
};

export { getAllUsers, getCurrentUser };
