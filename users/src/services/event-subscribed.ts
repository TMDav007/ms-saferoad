import User from "../models/User";
import { StatusCodes } from "http-status-codes";
import { NextFunction, Request, Response } from "express";
import { IUser } from "../utils/types";
import { AppError } from "@sfroads/common";

export const handleTicketCreated = async (data: any) => {
  const {
    _id,
    offenderIDNumber,
    offenderName,
    createdBy,
    offense,
    price,
    plateNumber,
    carType,
    carModel,
    offenderPhoneNumber,
    evidenceUrl,
    evidenceCloudinaryId,
    status,
    createdAt,
    updatedAt,
  } = data;

  console.log("Im here");
  const newTicket = {
    _id,
    offenderIDNumber,
    offenderName,
    createdBy,
    offense,
    price,
    plateNumber,
    carType,
    carModel,
    offenderPhoneNumber,
    evidenceUrl,
    evidenceCloudinaryId,
    status,
    createdAt,
    updatedAt,
  };

  console.log("Im here");
  const userExist = await User.findOne({ NIN: offenderIDNumber });
  console.log(userExist);
  if (!userExist) {
    throw new AppError(404, "user record does not exist in the database");
  }
  return await User.findOneAndUpdate(
    {
      NIN: offenderIDNumber,
    },
    {
      $push: { ticket: newTicket },
    },
    { new: true, useFindAndModify: false }
  );
};
