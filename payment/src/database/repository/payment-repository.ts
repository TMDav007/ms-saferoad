import Notification from "../models/Payment";
import { IPayment } from "../../utils/types";
import { AppError } from "@sfroads/common";
import Payment from "../models/Payment";

export default class PaymentRepository {
  async createPayment({
    userId,
    ticketId,
    gatewayReferenceId,
    status,
    amount,
  }: IPayment) {
    try {
      const payment = new Payment({
        userId,
        ticketId,
        gatewayReferenceId,
        status,
        amount,
      });

      return await payment.save();
    } catch (err: any) {
      throw new AppError(500, err.message);
    }
  }

  async Payments(userId: string) {
    const userPayment = (await Payment.find({ userId: userId })) as [IPayment];

    if (userPayment) return userPayment;
    return "";
  }

  async Payment(id: string) {
    const payment = (await Payment.findById(id)) as IPayment;

    return payment;
  }
  async DeletePayment(id: string) {
    const notification = await Notification.findByIdAndDelete(id);

    return;
  }
}
