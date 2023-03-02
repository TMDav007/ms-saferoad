import { Subjects } from "./subjects";

export interface TicketUpdatedEvent {
  subject: Subjects.TicketUpdated;
  data: {
    plateNumber: string;
    carType: string;
    carModel: string;
    offenderPhoneNumber: string;
    evidenceUrl?: string;
    evidenceCloudinaryId?: string;
  };
}
