"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Payment_1 = __importDefault(require("../models/Payment"));
const common_1 = require("@sfroads/common");
const Payment_2 = __importDefault(require("../models/Payment"));
class PaymentRepository {
    createPayment({ userId, ticketId, gatewayReferenceId, status, amount, }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payment = new Payment_2.default({
                    userId,
                    ticketId,
                    gatewayReferenceId,
                    status,
                    amount,
                });
                return yield payment.save();
            }
            catch (err) {
                throw new common_1.AppError(500, err.message);
            }
        });
    }
    Payments(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const userPayment = (yield Payment_2.default.find({ userId: userId }));
            if (userPayment)
                return userPayment;
            return "";
        });
    }
    Payment(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const payment = (yield Payment_2.default.findById(id));
            return payment;
        });
    }
    DeletePayment(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const notification = yield Payment_1.default.findByIdAndDelete(id);
            return;
        });
    }
}
exports.default = PaymentRepository;
