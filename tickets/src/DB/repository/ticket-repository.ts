import { AppError } from "@sfroads/common";
import { Response } from "express";
import Ticket from "../../models/Ticket";
import { ITicket } from "../../utils/types";

export default class TicketRepository {
  async createTicket(
    req: any,
    {
      offenderIDNumber,
      offenderName,
      plateNumber,
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
        offenderName,
        createdBy: req.currentUser?.id,
        plateNumber,
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
    const ticket = await Ticket.findById(id);

    return ticket;
  }
  catch(err: any) {
    throw new AppError(500, err);
  }

  async findAllTickets() {
    const allTickets: any = await Ticket.find();
    return allTickets;
  }

  async editATicket(
    id: string,
    {
      offenderIDNumber,
      offenderName,
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
          offenderName,
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
