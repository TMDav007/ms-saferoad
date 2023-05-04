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
const notification_repository_1 = __importDefault(require("../../database/repository/notification-repository"));
const common_1 = require("@sfroads/common");
const notification = new notification_repository_1.default();
exports.default = (app, channel) => {
    app.get("/api/v1/notification", (_req, res) => {
        return res.status(200).json({
            message: "Welcome to safe road NOTIFICATION SERVICE entry point",
        });
    });
    app.post("/api/v1/notification", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { userId, message, status, createdAt, updatedAt } = req.body;
            const data = yield notification.createNotification({
                userId,
                message,
                status,
                createdAt,
                updatedAt,
            });
            return res.status(http_status_codes_1.StatusCodes.CREATED).json({
                message: "Notification created successfully",
                success: true,
                data,
            });
        }
        catch (err) {
            next(err);
        }
    }));
    app.get("/api/v1/notification/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const data = yield notification.Notification(req.params.id);
            if (!data) {
                throw new common_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, "Notification not found");
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
    app.get("/api/v1/notifications/", common_1.auth, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log(req.user);
            const data = yield notification.UserNotifications(req.user.NIN);
            if (!data.length) {
                throw new common_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, "Notifications not found");
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
    app.get("/api/v1/notificationss/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log(req.user);
            const data = yield notification.AllNotifications();
            if (!data.length) {
                throw new common_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, "Notifications not found");
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
    app.delete("/api/v1/notification/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield notification.DeleteNotification(req.params.id);
            return res.status(http_status_codes_1.StatusCodes.OK).json({
                message: "Request was successfully",
                success: true,
                data: null,
            });
        }
        catch (err) {
            next(err);
        }
    }));
};
