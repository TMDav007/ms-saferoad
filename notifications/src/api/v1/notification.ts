import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import NotificationRepository from "../../database/repository/notification-repository";
import { INotification } from "../../utils/types";
import { AppError, auth } from "@sfroads/common";

const notification = new NotificationRepository();

export default (app: any, channel: any) => {
  app.get("/api/v1/notification", (_req: Request, res: Response) => {
    return res.status(200).json({
      message: "Welcome to safe road NOTIFICATION SERVICE entry point",
    });
  });

  app.post(
    "/api/v1/notification",
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { userId, message, status, createdAt, updatedAt }: INotification =
          req.body;

        const data = await notification.createNotification({
          userId,
          message,
          status,
          createdAt,
          updatedAt,
        });

        return res.status(StatusCodes.CREATED).json({
          message: "Notification created successfully",
          success: true,
          data,
        });
      } catch (err) {
        next(err);
      }
    }
  );

  app.get(
    "/api/v1/notification/:id",
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await notification.Notification(req.params.id);
        if (!data) {
          throw new AppError(StatusCodes.NOT_FOUND, "Notification not found");
        }

        return res.status(StatusCodes.OK).json({
          message: "Request was successfully",
          success: true,
          data,
        });
      } catch (err) {
        next(err);
      }
    }
  );

  app.get(
    "/api/v1/notifications/",
    auth,
    async (req: any, res: Response, next: NextFunction) => {
      try {
        console.log(req.user);
        const data = await notification.UserNotifications(req.user.NIN);
        if (!data.length) {
          throw new AppError(StatusCodes.NOT_FOUND, "Notifications not found");
        }

        return res.status(StatusCodes.OK).json({
          message: "Request was successfully",
          success: true,
          data,
        });
      } catch (err) {
        next(err);
      }
    }
  );

  app.get(
    "/api/v1/notificationss/",
    async (req: any, res: Response, next: NextFunction) => {
      try {
        console.log(req.user);
        const data = await notification.AllNotifications();
        if (!data.length) {
          throw new AppError(StatusCodes.NOT_FOUND, "Notifications not found");
        }

        return res.status(StatusCodes.OK).json({
          message: "Request was successfully",
          success: true,
          data,
        });
      } catch (err) {
        next(err);
      }
    }
  );

  app.delete(
    "/api/v1/notification/:id",
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        await notification.DeleteNotification(req.params.id);

        return res.status(StatusCodes.OK).json({
          message: "Request was successfully",
          success: true,
          data: null,
        });
      } catch (err) {
        next(err);
      }
    }
  );
};
