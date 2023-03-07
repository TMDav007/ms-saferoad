import { Subjects } from "./subjects";

export interface TicketUpdatedEvent {
  subject: Subjects.TicketUpdated;
  data: {
    id: string
    plateNumber: string;
    carType: string;
    offense: string;
    price: string;
    carModel: string;
    offenderPhoneNumber: string;
    evidenceUrl?: string;
    evidenceCloudinaryId?: string;
  };
}
