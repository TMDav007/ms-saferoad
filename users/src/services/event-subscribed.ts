import User from "../models/User";
import { StatusCodes } from "http-status-codes";
import { NextFunction, Request, Response } from "express";

export const handleTicketCreated = async (data: any) => {
  const {
    id,
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

  const newTicket = {
    id,
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

  await User.findOneAndUpdate(
    {
      NIN: offenderIDNumber,
    },
    {
      $push: { ticket: newTicket },
    },
    { new: true, useFindAndModify: false }
  );
};
