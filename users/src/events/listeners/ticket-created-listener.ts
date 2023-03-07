import { Message } from "node-nats-streaming";
import { Listener } from "../../eventscopy/base-listener";
import { Subjects } from "../../eventscopy/subjects";
import { TicketCreatedEvent } from "../../eventscopy/ticket-created-event";
// import { Subjects, Listener, TicketCreatedEvent } from "../../eventscopy";
import Ticket from "../../models/Ticket";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = "users-service";

  async onMessage(data: TicketCreatedEvent["data"], msg: Message) {
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

    const ticket = new Ticket({
      _id: id,
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
    });

    await ticket.save();
    msg.ack();
  }
}
