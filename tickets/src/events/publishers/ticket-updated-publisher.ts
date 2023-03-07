import { Publisher, Subjects, TicketUpdatedEvent } from "@sfroads/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
