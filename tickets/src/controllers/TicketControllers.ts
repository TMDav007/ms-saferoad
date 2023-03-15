import { StatusCodes } from "http-status-codes";
import { NextFunction, Request, Response } from "express";
import { AppError } from "@sfroads/common";
import Ticket from "../models/Ticket";
import { validateTicketData } from "../utils/validations";
import { TicketCreatedPublisher } from "../events/publishers/ticket-created-publisher";
import { natsWrapper } from "../nats-wrapper";
import { TicketUpdatedPublisher } from "../events/publishers/ticket-updated-publisher";
//import { channel } from "../server";
import { PublishMessage } from "../producer";

export default () => {
  const createATicket = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const {
      offenderIDNumber,
      offenderName,
      officerId,
      plateNumber,
      offense,
      price,
      carType,
      carModel,
      offenderPhoneNumber,
    } = req.body;
    try {
      // if (req?.currentUser?.userType === "Officer") {
      //   throw new AppError(403, "Not authorized!!!");
      // }
      // const valid = validateTicketData(req.body);
      // if (valid.error) {
      //   throw new AppError(StatusCodes.BAD_REQUEST, "Invalid ticket details");
      // }

      const ticket = new Ticket({
        offenderIDNumber,
        offenderName,
        officerId,
        createdBy: req.currentUser?.id,
        plateNumber,
        offense,
        price,
        carModel,
        carType,
        offenderPhoneNumber,
      });

      const newTicket = await ticket.save();

      //Publisher event
      const eventData = {
        id: newTicket.id,
        offenderIDNumber: newTicket.offenderIDNumber,
        offenderName: newTicket.offenderName,
        createdBy: newTicket.createdBy,
        plateNumber: newTicket.plateNumber,
        offense: newTicket.offense,
        price: newTicket.price,
        carType: newTicket.carType,
        carModel: newTicket.carModel,
        offenderPhoneNumber: newTicket.offenderPhoneNumber,
        status: newTicket.status,
        createdAt: newTicket.createdAt,
        updatedAt: newTicket.updatedAt,
      };

      const msg = {
        action: "Ticket:Created",
        data: eventData,
      };
      PublishMessage(
        "ch",
        process.env.TICKET_BINDING_KEY,
        JSON.stringify(msg)
      );
      // producer(JSON.stringify(msg));
      return res.status(StatusCodes.CREATED).json({
        message: "Ticket created successfully",
        success: true,
        data: newTicket,
      });
    } catch (err) {
      next(err);
    }
  };

  const getATicket = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const ticket = await Ticket.findById(req.params.id);

      if (!ticket) {
        throw new AppError(StatusCodes.NOT_FOUND, "Ticket not found");
      }
    } catch (err) {
      next(err);
    }
  };

  const getAllTickets = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const allTickets = await Ticket.find();
      return res.status(StatusCodes.OK).json({
        message: "Request was successfully",
        success: true,
        data: allTickets,
      });
    } catch (err) {
      next(err);
    }
  };

  const editATicket = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const {
      offenderIDNumber,
      offenderName,
      officerId,
      price,
      offense,
      plateNumber,
      carType,
      carModel,
      offenderPhoneNumber,
    } = req.body;
    try {
      if (req?.currentUser?.userType === "Officer") {
        throw new AppError(403, "Not authorized!!!");
      }
      const ticket = await Ticket.findById(req.params.id);
      if (!ticket) {
        throw new AppError(StatusCodes.NOT_FOUND, "Ticket not found");
      }
      const updatedTicket: any = await Ticket.findByIdAndUpdate(
        req.params.id,
        {
          price,
          offense,
          offenderName,
          offenderPhoneNumber,
          plateNumber,
          carModel,
          carType,
        },
        { new: true, useFindAndModify: false }
      );
      await new TicketUpdatedPublisher(natsWrapper.client).publish({
        id: updatedTicket._id,
        plateNumber: updatedTicket.plateNumber,
        offense: updatedTicket.offense,
        price: updatedTicket.price,
        carType: updatedTicket?.carType,
        carModel: updatedTicket.carModel,
        offenderPhoneNumber: updatedTicket.offenderPhoneNumber,
      });
      return res.status(StatusCodes.OK).json({
        message: "update successful",
        success: true,
        data: updatedTicket,
      });
    } catch (err) {
      next(err);
    }
  };
};
