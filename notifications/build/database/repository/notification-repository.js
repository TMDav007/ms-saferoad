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
const Notification_1 = __importDefault(require("../models/Notification"));
const common_1 = require("@sfroads/common");
class NotificationRepository {
    createNotification({ userId, message }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const notification = new Notification_1.default({
                    userId,
                    message,
                });
                return yield notification.save();
            }
            catch (err) {
                throw new common_1.AppError(500, err.message);
            }
        });
    }
    UserNotifications(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const userNotifications = (yield Notification_1.default.find({ userId: userId }));
            if (userNotifications)
                return userNotifications;
            return "";
        });
    }
    AllNotifications() {
        return __awaiter(this, void 0, void 0, function* () {
            const userNotifications = (yield Notification_1.default.find());
            if (userNotifications)
                return userNotifications;
            return "";
        });
    }
    Notification(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const notification = (yield Notification_1.default.findByIdAndUpdate(id, {
                status: "read",
                updatedAt: Date.now(),
            }, { new: true, useFindAndModify: false }));
            return notification;
        });
    }
    DeleteNotification(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const notification = yield Notification_1.default.findByIdAndDelete(id);
            return;
        });
    }
}
exports.default = NotificationRepository;
