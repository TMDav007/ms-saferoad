import Notification from "../models/Notification";
import { INotification } from "../../utils/types";
import { AppError } from "@sfroads/common";

export default class NotificationRepository {
  async createNotification({ userId, message }: INotification) {
    try {
      const notification = new Notification({
        userId,
        message,
      });

      return await notification.save();
    } catch (err: any) {
      throw new AppError(500, err.message);
    }
  }

  async UserNotifications(userId: string) {
    const userNotifications = (await Notification.find({ userId: userId })) as [
      INotification
    ];

    if (userNotifications) return userNotifications;
    return "";
  }

  async AllNotifications() {
    const userNotifications = (await Notification.find()) as [INotification];

    if (userNotifications) return userNotifications;
    return "";
  }

  async Notification(id: string) {
    const notification = (await Notification.findByIdAndUpdate(
      id,
      {
        status: "read",
        updatedAt: Date.now(),
      },
      { new: true, useFindAndModify: false }
    )) as INotification;

    return notification;
  }
  async DeleteNotification(id: string) {
    const notification = await Notification.findByIdAndDelete(id);

    return;
  }
}
