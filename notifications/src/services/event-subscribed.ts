import NotificationRepository from "../database/repository/notification-repository";

import { AppError } from "@sfroads/common";

const notify = new NotificationRepository();
export const handleTicketCreated = async (data: any) => {
  const { userId, message } = data;
  return await notify.createNotification({ userId, message });
};
