import { Subjects } from "./subjects";

export interface TicketCreatedEvent {
  subject: Subjects.TicketCreated;
  data: {
    id: string;
    offenderIDNumber: string;
    offenderName: string;
    createdBy: string;
    offense: string;
    price: string;
    plateNumber: string;
    carType: string;
    carModel: string;
    offenderPhoneNumber: string;
    evidenceUrl?: string;
    evidenceCloudinaryId?: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
  };
}
