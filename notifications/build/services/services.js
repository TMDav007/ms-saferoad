"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscribeEvents = void 0;
const event_subscribed_1 = require("./event-subscribed");
const subject_1 = require("./subject");
const SubscribeEvents = (payload) => {
    console.log("Triggering Notification services");
    payload = JSON.parse(payload);
    const { action, data } = payload;
    switch (action) {
        case subject_1.Subjects.TicketCreated:
            (0, event_subscribed_1.handleCreateNotification)(data);
        case subject_1.Subjects.PaymentSuccess:
            (0, event_subscribed_1.handleCreateNotification)(data);
            break;
        default:
            break;
    }
};
exports.SubscribeEvents = SubscribeEvents;
