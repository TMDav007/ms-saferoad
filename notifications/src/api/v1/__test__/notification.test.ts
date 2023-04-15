import supertest from "supertest";
import express from "express";
import createServer from "../../../app";

const app = express();
const server = createServer(app);

describe("Notification - test", () => {
  it("should create a notification", async () => {
    const response = await supertest(server)
      .post("/api/v1/notification/")
      .send({
        userId: "63cd5cb1e2f78f23abfc9def",
        message: "You have paid for your ticket",
      });
    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Notification created successfully");
  });
  it("should get all user's notifications", async () => {
    const response = await supertest(server)
      .get("/api/v1/notifications/")
      .send({
        userId: "63cd5cb1e2f78f23abfc9def",
      });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Request was successfully");
  });
  it("should get a user's notification", async () => {
    const notify = await supertest(server).post("/api/v1/notification/").send({
      userId: "63cd5cb1e2f78f23abfc9def",
      message: "notification test",
    });
    const response = await supertest(server).get(
      `/api/v1/notification/${notify.body.data.id}`
    );
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Request was successfully");
  });
  it("should delete a user's notification", async () => {
    const notify = await supertest(server).post("/api/v1/notification/").send({
      userId: "63cd5cb1e2f78f23abfc9def",
      message: "notification test",
    });
    const response = await supertest(server).get(
      `/api/v1/notification/${notify.body.data.id}`
    );
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Request was successfully");
  });
});
