"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const PaymentSchema = new mongoose_1.Schema({
    status: {
        type: "string",
        enum: ["success", "failed"],
        required: true,
    },
    userId: {
        type: "string",
        required: true,
    },
    ticketId: {
        type: "string",
        required: true,
    },
    gatewayReferenceId: {
        type: "string",
        required: false,
    },
    gatewayName: {
        type: "string",
        default: "Paystack",
        required: false,
    },
    amount: {
        type: "number",
        required: true,
    },
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        },
    },
});
exports.default = (0, mongoose_1.model)("Payment", PaymentSchema);
