import supertest from "supertest";
import express from "express";

import createServer from "../../app";

const app = express();

const server = createServer(app);

describe("Auth - Signup", () => {
  it("should signup a user with valid credientials", async () => {
    const response = await supertest(server).post("/api/v1/auth/signup").send({
      fullName: "Miss Toshibar Mike",
      email: "missToshivar09@gmail.com",
    });
    expect(response.status).toBe(201);
    expect(response.body.message).toBe(
      "Signup was successful. Kindly check your email to activate your account"
    );
    expect(response.get("Set-Cookie")).toBeDefined;
  });

  it("should not signup a user an invalid credentials", async () => {
    const response = await supertest(server).post("/api/v1/auth/signup").send({
      fullName: "Miss Toshibar Mike",
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("User's details provided are invalid.");
  });
  it("should not signup a user with missing credentials", async () => {
    const response = await supertest(server)
      .post("/api/v1/auth/signup")
      .send({});
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("User's details provided are invalid.");
  });

  it("should not signup a user with an existing email", async () => {
    const response = await supertest(server).post("/api/v1/auth/signup").send({
      fullName: "Miss Toshibar Mike",
      email: "missToshivar09@gmail.com",
    });
    expect(response.status).toBe(409);
    expect(response.body.message).toBe("User already exists");
  });
});

describe("Auth - Verify", () => {
  it("should not verify a user with invalid credentials", async () => {
    const response = await supertest(server).post("/api/v1/auth/verify").send({
      otp: "Miss Toshibar Mike",
      email: "missToshivar09@gmail.com",
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "Account verification details provided are invalid."
    );
  });

  it("should not verify a user with empty credentials", async () => {
    const response = await supertest(server)
      .post("/api/v1/auth/verify")
      .send({});
    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "Account verification details provided are invalid."
    );
  });
});

describe("Auth - Signout", () => {
  it("should signoff a user", async () => {
    const response = await supertest(server)
      .post("/api/v1/auth/signout")
      .send({});
    expect(response.status).toBe(200);
    expect(response.get("Set-Cookie")).toBeUndefined;
  });
});
