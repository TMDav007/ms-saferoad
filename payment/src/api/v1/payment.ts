import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import _ from "lodash";
import request from "request";
import PaymentRepository from "../../database/repository/payment-repository";
import { paystack } from "../middlewares/paystack";
import { PublishMessage } from "../../services/messageBroker";
import { Subjects } from "../../services/subject";
import { AppError, auth } from "@sfroads/common";

// const { initializePayment, verifyPayment } = require("./../middlewares/paystack")(request);

const payment = new PaymentRepository();

export default (app: any, channel: any) => {
  const { initializePayment, verifyPayment } = paystack(request);

  app.get("/api/v1/payment", (_req: Request, res: Response) => {
    return res.status(200).json({
      message: "Welcome to safe road PAYMENT SERVICE entry point",
    });
  });

  app.post(
    "/api/v1/initiate",
    auth,
    async (req: any, res: Response, next: NextFunction) => {
      try {
        const { amount, email, fullName, offense, ticketId } = req.body;

        const form = {
          amount,
          email,
          metadata: {
            fullName,
            offense,
            userId: req.user.userId,
            ticketId,
          },
        };

        initializePayment(form, (error: any, body: any) => {
          if (error) {
            //handle errors
            console.log("error: " + error);
            res.status(400).json(error);
            return;
          }
          let response = JSON.parse(body);
          if (response.status === false) {
            return res.status(400).json(response);
          }
          return res.status(StatusCodes.CREATED).json({
            message: "Payment initiated  successfully",
            success: true,
            data: response,
          });
          //res.redirect(response.data.authorization_url);
        });
      } catch (err) {
        next(err);
      }
    }
  );

  app.post(
    "/api/v1/verify",
    auth,
    async (req: any, res: Response, next: NextFunction) => {
      try {
        const ref = req.body.reference;
        verifyPayment(ref, async (error: any, body: any) => {
          if (error) {
            //handle errors appropriately
            console.log(error);
            return next(error);
          }
          let response = JSON.parse(body);
          const data = _.at(response.data, [
            "reference",
            "amount",
            "customer.email",
            "metadata.fullName",
            "metadata.ticketId",
            "metadata.offense",
            "status",
          ]);
          const log = _.at(response.data.log, ["errors", "history", "success"]);

          const [
            reference,
            amount,
            email,
            fullName,
            ticket_id,
            offense,
            status,
          ] = data;
          const [errors, history, success] = log;

          console.log("history: " + history);
          if (status !== "success" || errors >= 1 || !success) {
            await payment.createPayment({
              status: "failed",
              userId: req.user.userId,
              ticketId: ticket_id,
              gatewayReferenceId: reference,
              amount: amount / 100,
            });

            return res
              .status(422)
              .json({ message: "Payment initiation unsuccessful" });
          }

          await payment.createPayment({
            status: "success",
            userId: req.user.userId,
            ticketId: ticket_id,
            gatewayReferenceId: reference,
            amount: amount / 100,
          });

          const msg: any = {
            action: Subjects.PaymentSuccess,
            data: {
              ticketId: ticket_id,
            },
          };

          PublishMessage(
            channel,
            process.env.TICKET_BINDING_KEY!,
            JSON.stringify(msg)
          );

          PublishMessage(
            channel,
            process.env.NOTIFICATION_BINDING_KEY!,
            JSON.stringify({
              action: Subjects.PaymentSuccess,
              data: {
                message: `Your payment of ${amount} for ${offense} was successful`,
                userId: req.user.NIN,
              },
            })
          );

          return res.status(StatusCodes.CREATED).json({
            message: response.message,
            success: true,
            data: null,
          });
        });
      } catch (err) {
        next(err);
      }
    }
  );

  app.get(
    "/api/v1/payment/:id",
    auth,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await payment.Payment(req.params.id);
        if (!data) {
          throw new AppError(StatusCodes.NOT_FOUND, "Payment not found");
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
    "/api/v1/payments/",
    auth,
    async (req: any, res: Response, next: NextFunction) => {
      try {
        const data = await payment.Payments(req.user.userId);
        if (!data.length) {
          throw new AppError(StatusCodes.NOT_FOUND, "Payment not found");
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
};
