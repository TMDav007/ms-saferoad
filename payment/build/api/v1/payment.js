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
const http_status_codes_1 = require("http-status-codes");
const lodash_1 = __importDefault(require("lodash"));
const request_1 = __importDefault(require("request"));
const payment_repository_1 = __importDefault(require("../../database/repository/payment-repository"));
const paystack_1 = require("../middlewares/paystack");
const messageBroker_1 = require("../../services/messageBroker");
const subject_1 = require("../../services/subject");
const common_1 = require("@sfroads/common");
// const { initializePayment, verifyPayment } = require("./../middlewares/paystack")(request);
const payment = new payment_repository_1.default();
exports.default = (app, channel) => {
    const { initializePayment, verifyPayment } = (0, paystack_1.paystack)(request_1.default);
    app.get("/api/v1/payment", (_req, res) => {
        return res.status(200).json({
            message: "Welcome to safe road PAYMENT SERVICE entry point",
        });
    });
    app.post("/api/v1/initiate", common_1.auth, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
            initializePayment(form, (error, body) => {
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
                return res.status(http_status_codes_1.StatusCodes.CREATED).json({
                    message: "Payment initiated  successfully",
                    success: true,
                    data: response,
                });
                //res.redirect(response.data.authorization_url);
            });
        }
        catch (err) {
            next(err);
        }
    }));
    app.post("/api/v1/verify", common_1.auth, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const ref = req.body.reference;
            verifyPayment(ref, (error, body) => __awaiter(void 0, void 0, void 0, function* () {
                if (error) {
                    //handle errors appropriately
                    console.log(error);
                    return next(error);
                }
                let response = JSON.parse(body);
                const data = lodash_1.default.at(response.data, [
                    "reference",
                    "amount",
                    "customer.email",
                    "metadata.fullName",
                    "metadata.ticketId",
                    "metadata.offense",
                    "status",
                ]);
                const log = lodash_1.default.at(response.data.log, ["errors", "history", "success"]);
                const [reference, amount, email, fullName, ticket_id, offense, status,] = data;
                const [errors, history, success] = log;
                console.log("history: " + history);
                if (status !== "success" || errors >= 1 || !success) {
                    yield payment.createPayment({
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
                yield payment.createPayment({
                    status: "success",
                    userId: req.user.userId,
                    ticketId: ticket_id,
                    gatewayReferenceId: reference,
                    amount: amount / 100,
                });
                const msg = {
                    action: subject_1.Subjects.PaymentSuccess,
                    data: {
                        ticketId: ticket_id,
                    },
                };
                (0, messageBroker_1.PublishMessage)(channel, process.env.TICKET_BINDING_KEY, JSON.stringify(msg));
                (0, messageBroker_1.PublishMessage)(channel, process.env.NOTIFICATION_BINDING_KEY, JSON.stringify({
                    action: subject_1.Subjects.PaymentSuccess,
                    data: {
                        message: `Your payment of ${amount} for ${offense} was successful`,
                        userId: req.user.NIN,
                    },
                }));
                return res.status(http_status_codes_1.StatusCodes.CREATED).json({
                    message: response.message,
                    success: true,
                    data: null,
                });
            }));
        }
        catch (err) {
            next(err);
        }
    }));
    app.get("/api/v1/payment/:id", common_1.auth, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const data = yield payment.Payment(req.params.id);
            if (!data) {
                throw new common_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, "Payment not found");
            }
            return res.status(http_status_codes_1.StatusCodes.OK).json({
                message: "Request was successfully",
                success: true,
                data,
            });
        }
        catch (err) {
            next(err);
        }
    }));
    app.get("/api/v1/payments/", common_1.auth, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const data = yield payment.Payments(req.user.userId);
            if (!data.length) {
                throw new common_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, "Payment not found");
            }
            return res.status(http_status_codes_1.StatusCodes.OK).json({
                message: "Request was successfully",
                success: true,
                data,
            });
        }
        catch (err) {
            next(err);
        }
    }));
};
