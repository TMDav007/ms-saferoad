import { AppError } from "@sfroads/common";
import { Response } from "express";
import Ticket from "../../models/Ticket";
import { ITicket } from "../../utils/types";

export default class TicketRepository {
  async createTicket(
    req: any,
    {
      offenderIDNumber,
      offenderFullName,
      plateNumber,
      location,
      offense,
      price,
      carType,
      carModel,
      offenderPhoneNumber,
    }: ITicket
  ) {
    try {
      const ticket = new Ticket({
        offenderIDNumber,
        offenderFullName,
        createdBy: req.user?.userId,
        plateNumber,
        location,
        offense,
        price,
        carModel,
        carType,
        offenderPhoneNumber,
      });

      const newTicket: ITicket = await ticket.save();

      return newTicket;
    } catch (err: any) {
      throw new AppError(500, err);
    }
  }

  async findATicket(id: any) {
    try {
      const ticket = await Ticket.findById(id);

      return ticket;
    } catch (err: any) {
      throw new AppError(500, err);
    }
  }

  async getATicketByOfficer(userId: string, id: string) {
    try {
      const booking = await Ticket.find({ createdBy: userId, id });

      return booking;
    } catch (err: any) {
      throw new AppError(500, err);
    }
  }
  async getATicketByOffender(offenderIDNumber: string, id: string) {
    try {
      const booking = await Ticket.find({ offenderIDNumber, id });

      return booking;
    } catch (err: any) {
      throw new AppError(500, err);
    }
  }

  async getAllTicketsByOfficer(userId: string) {
    try {
      const booking = await Ticket.find({ createdBy: userId });

      return booking;
    } catch (err: any) {
      throw new AppError(500, err);
    }
  }

  async getAllTicketsByOffender(offenderIDNumber: string) {
    try {
      const booking = await Ticket.find({ offenderIDNumber });

      return booking;
    } catch (err: any) {
      throw new AppError(500, err);
    }
  }
  async findAllTickets() {
    try {
      const allTickets: any = await Ticket.find();
      return allTickets;
    } catch (err: any) {
      throw new AppError(500, err);
    }
  }

  async editATicket(
    id: string,
    {
      offenderIDNumber,
      offenderFullName,
      price,
      offense,
      plateNumber,
      carType,
      carModel,
      offenderPhoneNumber,
    }: ITicket
  ) {
    try {
      const updatedTicket = await Ticket.findByIdAndUpdate(
        id,
        {
          price,
          offense,
          offenderFullName,
          offenderPhoneNumber,
          plateNumber,
          carModel,
          carType,
        },
        { new: true, useFindAndModify: false }
      );

      return updatedTicket;
    } catch (err) {}
  }
}
