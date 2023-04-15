import {
  AppError,
  requireAuth,
  requireOfficerAuth,
  auth,
} from "@sfroads/common";

import { Router, Request, Response, NextFunction } from "express";

import { StatusCodes } from "http-status-codes";
import TicketRepository from "../DB/repository/ticket-repository";
import { PublishMessage } from "../producer";
import { ITicket } from "../utils/types";
import { validateTicketData } from "../utils/validations";

const ticket = new TicketRepository();
export default (app: any, channel: any) => {
  // const q = app.Router()
  app.get("/", (_req: Request, res: Response) => {
    return res
      .status(200)
      .json({ message: "Welcome to safe road ticket entry point" });
  });
  app.get("/api/v1/ticket", (_req: Request, res: Response) => {
    return res
      .status(200)
      .json({ message: "Welcome to safe road TICKET SERVICE entry point" });
  });
  app.post(
    "/api/v1/ticket",
    auth,
    requireOfficerAuth,
    async (req: any, res: Response, next: NextFunction) => {
      try {
        const {
          offenderIDNumber,
          offenderFullName,
          location,
          price,
          offense,
          plateNumber,
          carType,
          carModel,
          offenderPhoneNumber,
          offenderEmail,
        }: ITicket = req.body;
        const valid: any = validateTicketData(req.body);
        if (valid.error) {
          throw new AppError(StatusCodes.BAD_REQUEST, valid.error.message);
        }
        const data = await ticket.createTicket(req, {
          offenderIDNumber,
          offenderFullName,
          location,
          price,
          createdBy: req.user.id,
          offense,
          plateNumber,
          carType,
          carModel,
          offenderPhoneNumber,
          offenderEmail,
        });
        const msg: any = {
          action: "Ticket:Created",
          data,
        };

        PublishMessage(
          channel,
          process.env.USER_BINDING_KEY,
          JSON.stringify(msg)
        );

        PublishMessage(
          channel,
          process.env.NOTIFICATION_BINDING_KEY,
          JSON.stringify({
            action: "Ticket:Created",
            data: {
              message: `A ticket for ${offense} has been booked for you`,
              userId: offenderIDNumber,
            },
          })
        );

        return res.status(StatusCodes.CREATED).json({
          message: "Ticket created successfully",
          success: true,
          data,
        });
      } catch (err) {
        next(err);
      }
    }
  );

  app.get(
    "/api/v1/ticket/allTickets",
    auth,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await ticket.findAllTickets();
        return res.status(StatusCodes.OK).json({
          message: "Request was successfully",
          success: true,
          data,
        });
      } catch (err) {
        next(err);
      }
    }
  );

  app.get(
    "/api/v1/ticket/:id",
    auth,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await ticket.findATicket(req.params.id);
        if (!ticket) {
          throw new AppError(StatusCodes.NOT_FOUND, "Ticket not found");
        }

        return res.status(StatusCodes.OK).json({
          message: "Request was successfully",
          success: true,
          data,
        });
      } catch (err) {
        next(err);
      }
    }
  );

  app.get(
    "/api/v1/ticket/officer/tickets",
    auth,
    requireOfficerAuth,
    async (req: any, res: Response, next: NextFunction) => {
      try {
        const data = await ticket.getAllTicketsByOfficer(req.user.userId);
        if (!data) {
          throw new AppError(StatusCodes.NOT_FOUND, "Ticket not found");
        }

        return res.status(StatusCodes.OK).json({
          message: "Request was successfully",
          success: true,
          data,
        });
      } catch (err) {
        next(err);
      }
    }
  );

  app.get(
    "/api/v1/ticket/offender/tickets",
    auth,
    async (req: any, res: Response, next: NextFunction) => {
      try {
        if (req.user.userType !== "Offender")
          throw new AppError(StatusCodes.UNAUTHORIZED, "Unauthorized");
        // console.log(req.user, "uehsnd")
        const data = await ticket.getAllTicketsByOffender(req.user.NIN);
        if (!data) {
          throw new AppError(StatusCodes.NOT_FOUND, "Ticket not found");
        }

        return res.status(StatusCodes.OK).json({
          message: "Request was successfully",
          success: true,
          data,
        });
      } catch (err) {
        next(err);
      }
    }
  );

  app.get(
    "/api/v1/ticket/officer/:id",
    auth,
    requireOfficerAuth,
    async (req: any, res: Response, next: NextFunction) => {
      try {
        const data = await ticket.findATicket(req.params.id);
        if (!data) {
          throw new AppError(StatusCodes.NOT_FOUND, "Ticket not found");
        }

        return res.status(StatusCodes.OK).json({
          message: "Request was successfully",
          success: true,
          data,
        });
      } catch (err) {
        next(err);
      }
    }
  );

  app.get(
    "/api/v1/ticket/offender/:id",
    auth,
    async (req: any, res: Response, next: NextFunction) => {
      try {
        if (!req.params)
          throw new AppError(StatusCodes.BAD_REQUEST, "Ticket Id is required");
        if (req.user.userType !== "Offender")
          throw new AppError(StatusCodes.UNAUTHORIZED, "Unauthorized");
        const data = await ticket.findATicket(req.params.id);
        if (!data) {
          throw new AppError(StatusCodes.NOT_FOUND, "Ticket not found");
        }

        return res.status(StatusCodes.OK).json({
          message: "Request was successfully",
          success: true,
          data,
        });
      } catch (err) {
        next(err);
      }
    }
  );
};
