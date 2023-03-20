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
  //console.log(req)
  const msg = {
    action: "LOGIN",
    data: req?.user,
  };
  // producer(JSON.stringify(msg));
  return res.send({ user: req?.user || null });
};

export { getAllUsers, getCurrentUser };
