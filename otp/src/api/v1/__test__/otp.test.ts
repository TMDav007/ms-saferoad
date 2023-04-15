import supertest from "supertest";
import express from "express";
import createServer from "../../../app";

const app = express();
const server = createServer(app);

describe("OTP - test", () => {
  it("should create a OTP", async () => {
    const response = await supertest(server).post("/api/v1/otp/").send({
      userId: "63cd5cb1e2f78f23abfc9def",
    });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("OTP created successfully");
  });

  it("should get a verify OTP", async () => {
    const otp = await supertest(server).post("/api/v1/otp").send({
      userId: "63cd5cb1e2f78f23abfc9d34",
      otp: "12345",
    });

    console.log(otp.body)
  
    const response = await supertest(server).post("/api/v1/otp/verify").send({
      userId: otp.body.data.userId,
      otp: "12345",
    });
    console.log(response.body)
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("OTP verified successfully");
  });
//   it("should delete a user's notification", async () 
 });
