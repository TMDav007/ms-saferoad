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
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const app_1 = __importDefault(require("../../../app"));
const app = (0, express_1.default)();
const server = (0, app_1.default)(app);
describe("Notification - test", () => {
    it("should create a notification", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server)
            .post("/api/v1/notification/")
            .send({
            userId: "63cd5cb1e2f78f23abfc9def",
            message: "You have paid for your ticket",
        });
        expect(response.status).toBe(201);
        expect(response.body.message).toBe("Notification created successfully");
    }));
    it("should get all user's notifications", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server)
            .get("/api/v1/notifications/")
            .send({
            userId: "63cd5cb1e2f78f23abfc9def",
        });
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Request was successfully");
    }));
    it("should get a user's notification", () => __awaiter(void 0, void 0, void 0, function* () {
        const notify = yield (0, supertest_1.default)(server).post("/api/v1/notification/").send({
            userId: "63cd5cb1e2f78f23abfc9def",
            message: "notification test",
        });
        const response = yield (0, supertest_1.default)(server).get(`/api/v1/notification/${notify.body.data.id}`);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Request was successfully");
    }));
    it("should delete a user's notification", () => __awaiter(void 0, void 0, void 0, function* () {
        const notify = yield (0, supertest_1.default)(server).post("/api/v1/notification/").send({
            userId: "63cd5cb1e2f78f23abfc9def",
            message: "notification test",
        });
        const response = yield (0, supertest_1.default)(server).get(`/api/v1/notification/${notify.body.data.id}`);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Request was successfully");
    }));
});
