import { AppError, requireAuth, requireOfficerAuth } from "@sfroads/common";

import { Router, Request, Response, NextFunction } from "express";

import { StatusCodes } from "http-status-codes";
import TicketRepository from "../DB/repository/ticket-repository";
import { PublishMessage } from "../producer";
import { ITicket } from "../utils/types";
import v1 from "../utils/v1";

const ticket = new TicketRepository();
export default (app: any, channel: any) => {
  // const q = app.Router()
  app.get("/api/v1/ticket", (_req: Request, res: Response) => {
    console.log("jsdbjdsd");
    return res
      .status(200)
      .json({ message: "Welcome to safe road TICKET SERVICE entry point" });
  });
  app.post(
    "/api/v1/ticket",
    requireAuth,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const {
          offenderIDNumber,
          offenderName,
          price,
          offense,
          plateNumber,
          carType,
          carModel,
          offenderPhoneNumber,
        }: ITicket = req.body;
        const data = await ticket.createTicket(req, {
          offenderIDNumber,
          offenderName,
          price,
          offense,
          plateNumber,
          carType,
          carModel,
          offenderPhoneNumber,
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
    requireAuth,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { data } = await ticket.findAllTickets();
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
    "/ticket/:id",
    requireAuth,
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
};
