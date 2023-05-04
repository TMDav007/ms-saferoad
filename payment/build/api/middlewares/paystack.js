"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paystack = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const paystack = (request) => {
    const MySecretKey = `Bearer ${process.env.PAYSTACK_SECRET_KEY}`;
    // sk_test_xxxx to be replaced by your own secret key
    const initializePayment = (form, mycallback) => {
        const options = {
            url: "https://api.paystack.co/transaction/initialize",
            headers: {
                authorization: MySecretKey,
                "content-type": "application/json",
                "cache-control": "no-cache",
            },
            form,
        };
        const callback = (error, response, body) => {
            return mycallback(error, body);
        };
        request.post(options, callback);
    };
    const verifyPayment = (reference, mycallback) => {
        const options = {
            url: "https://api.paystack.co/transaction/verify/" +
                encodeURIComponent(reference),
            headers: {
                authorization: MySecretKey,
                "content-type": "application/json",
                "cache-control": "no-cache",
            },
        };
        const callback = (error, response, body) => {
            return mycallback(error, body);
        };
        request(options, callback);
    };
    return { initializePayment, verifyPayment };
};
exports.paystack = paystack;
