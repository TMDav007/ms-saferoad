import { Publisher,Subjects, TicketCreatedEvent } from "@sfroads/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
