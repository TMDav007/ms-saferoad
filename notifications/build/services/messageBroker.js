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
exports.RPCObserver = exports.RPCRequest = exports.SubscribeMessage = exports.PublishMessage = exports.CreateChannel = void 0;
const common_1 = require("@sfroads/common");
const amqplib_1 = __importDefault(require("amqplib"));
const uuid_1 = require("uuid");
let amqplibConnection = null;
//Message Broker
const getChannel = () => __awaiter(void 0, void 0, void 0, function* () {
    if (amqplibConnection === null) {
        amqplibConnection = yield amqplib_1.default.connect(process.env.AMQP_URL);
    }
    return yield amqplibConnection.createChannel();
});
const CreateChannel = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const channel = yield getChannel();
        yield channel.assertQueue(process.env.EXCHANGE_NAME, "direct", {
            durable: true,
        });
        return channel;
    }
    catch (err) {
        throw new common_1.AppError(500, err === null || err === void 0 ? void 0 : err.message);
    }
});
exports.CreateChannel = CreateChannel;
const PublishMessage = (channel, service, msg) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield channel.publish(process.env.EXCHANGE_NAME, service, Buffer.from(msg));
        console.log("Sent: ", msg);
    }
    catch (err) {
        throw new common_1.AppError(500, err === null || err === void 0 ? void 0 : err.message);
    }
});
exports.PublishMessage = PublishMessage;
const SubscribeMessage = (channel, service) => __awaiter(void 0, void 0, void 0, function* () {
    yield channel.assertExchange(process.env.EXCHANGE_NAME, "direct", {
        durable: true,
    });
    const q = yield channel.assertQueue("", { exclusive: true });
    console.log(` Waiting for messages in queue: ${q.queue}`);
    channel.bindQueue(q.queue, process.env.EXCHANGE_NAME, process.env.NOTIFICATION_BINDING_KEY);
    channel.consume(q.queue, (msg) => {
        if (msg) {
            console.log("the message is:", msg.content.toString());
            service(msg.content.toString());
        }
        console.log("notification data received");
    }, {
        noAck: false,
    });
});
exports.SubscribeMessage = SubscribeMessage;
const requestData = (RPC_QUEUE_NAME, requestPayload, uuid) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const channel = yield getChannel();
        const q = yield channel.assertQueue("", { exclusive: true });
        channel.sendToQueue(RPC_QUEUE_NAME, Buffer.from(JSON.stringify(requestPayload)), {
            replyTo: q.queue,
            correlationId: uuid,
        });
        return new Promise((resolve, reject) => {
            // timeout n
            const timeout = setTimeout(() => {
                channel.close();
                resolve("API could not fullfil the request!");
            }, 8000);
            channel.consume(q.queue, (msg) => {
                if (msg.properties.correlationId == uuid) {
                    resolve(JSON.parse(msg.content.toString()));
                    clearTimeout(timeout);
                }
                else {
                    reject("data Not found!");
                }
            }, {
                noAck: true,
            });
        });
    }
    catch (error) {
        console.log(error);
        return "error";
    }
});
const RPCRequest = (RPC_QUEUE_NAME, requestPayload) => __awaiter(void 0, void 0, void 0, function* () {
    const uuid = (0, uuid_1.v4)(); // correlationId
    return yield requestData(RPC_QUEUE_NAME, requestPayload, uuid);
});
exports.RPCRequest = RPCRequest;
const RPCObserver = (RPC_QUEUE_NAME, service) => __awaiter(void 0, void 0, void 0, function* () {
    const channel = yield getChannel();
    yield channel.assertQueue(RPC_QUEUE_NAME, {
        durable: false,
    });
    channel.prefetch(1);
    channel.consume(RPC_QUEUE_NAME, (msg) => __awaiter(void 0, void 0, void 0, function* () {
        if (msg.content) {
            // DB Operation
            const payload = JSON.parse(msg.content.toString());
            const response = yield service(payload);
            channel.sendToQueue(msg.properties.replyTo, Buffer.from(JSON.stringify(response)), {
                correlationId: msg.properties.correlationId,
            });
            channel.ack(msg);
        }
    }), {
        noAck: false,
    });
});
exports.RPCObserver = RPCObserver;
