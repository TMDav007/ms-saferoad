import supertest from "supertest";
import mongoose from "mongoose";
import dotenv from "dotenv";
import * as db from "./dbHandler";

import createServer from "../app";
const server = createServer();

dotenv.config();

describe("Auth", () => {
	/* Connecting to the database before all test. */
	beforeAll(async () => {
		await db.connect();
	});
	/* Closing database connection after each test. */
	afterEach(async () => {
		// await db.clearDatabase();
	});

	/* Destroy collection connection after all test. */
	afterAll(async () => {
		await db.closeDatabase();
	});

	it("should signup a user with a valid WIP", async () => {
		const response = await supertest(server).post("/api/v1/auth/signup").send({
			WIP: "A98745679",
			password: "test123",
			confirmPassword: "test123",
		});
		expect(response.status).toBe(201);
		expect(response.body.message).toBe(
			"Signup was successful. Kindly check your email to activate your account"
		);
	});

	it("should not signup a user valid with an existing WIP", async () => {
		const response = await supertest(server).post("/api/v1/auth/signup").send({
			WIP: "A98745679",
			password: "test123",
			confirmPassword: "test123",
		});
		expect(response.status).toBe(409);
		expect(response.body.message).toBe("User already exists");
	});

	it("should signup a user with a valid NIN", async () => {
		const response = await supertest(server).post("/api/v1/auth/signup").send({
			NIN: "23783AX91",
			password: "test123",
			confirmPassword: "test123",
		});
		expect(response.status).toBe(201);
		expect(response.body.message).toBe(
			"Signup was successful. Kindly check your email to activate your account"
		);
	});

	it("should signup a user with a valid email", async () => {
		const response = await supertest(server).post("/api/v1/auth/signup").send({
			firstName: "Abbey",
			lastName: "Morris",
			email: "abbey@gmail.com",
			phoneNumber: "08023453490",
			password: "test123",
			confirmPassword: "test123",
		});
		expect(response.status).toBe(201);
		expect(response.body.message).toBe(
			"Signup was successful. Kindly check your email to activate your account"
		);
	});

	it("should signup a user with a valid email", async () => {
		const response = await supertest(server).post("/api/v1/auth/signup").send({
			firstName: "Abbey",
			lastName: "Morris",
			email: "abbey@gmail.com",
			phoneNumber: "08023453490",
			password: "test123",
			confirmPassword: "test123",
		});
		expect(response.status).toBe(409);
		expect(response.body.message).toBe("User already exists");
	});

	it("should signup a user with an existing NIN", async () => {
		const response = await supertest(server).post("/api/v1/auth/signup").send({
			NIN: "23783AX91",
			password: "test123",
			confirmPassword: "test123",
		});
		expect(response.status).toBe(409);
		expect(response.body.message).toBe("User already exists");
	});

	it("should not signup a user with a invalid confirm password", async () => {
		const response = await supertest(server).post("/api/v1/auth/signup").send({
			WIP: "A98745679",
			password: "test123",
			confirmPassword: "test12",
		});
		expect(response.status).toBe(400);
		expect(response.body.message).toBe("User's details provided are invalid.");
	});

	it("should not signup a user with no request body", async () => {
		const response = await supertest(server)
			.post("/api/v1/auth/signup")
			.send({});
		expect(response.status).toBe(400);
		expect(response.body.message).toBe("User's details provided are invalid.");
	});

	it("should not signup a user with no existing WIP", async () => {
		const response = await supertest(server).post("/api/v1/auth/signup").send({
			WIP: "A9874569",
			password: "test123",
			confirmPassword: "test123",
		});
		expect(response.status).toBe(404);
		expect(response.body.message).toBe("Police ID does not exist");
	});

	it("should not signup a user with no existing NIN", async () => {
		const response = await supertest(server).post("/api/v1/auth/signup").send({
			NIN: "A9874569",
			password: "test123",
			confirmPassword: "test123",
		});
		expect(response.status).toBe(404);
		expect(response.body.message).toBe("NIN does not exist");
	});

	it("should not signup a user with an invalid email", async () => {
		const response = await supertest(server).post("/api/v1/auth/signup").send({
			email: "A9874569",
			password: "test123",
			confirmPassword: "test123",
		});
		expect(response.status).toBe(400);
		expect(response.body.message).toBe("User's details provided are invalid.");
	});

	it("should not signup a user with just the email provided", async () => {
		const response = await supertest(server).post("/api/v1/auth/signup").send({
			email: "email@yahoo.com",
			password: "test123",
			confirmPassword: "test123",
		});
		expect(response.status).toBe(400);
		expect(response.body.message).toBe("User's details provided are invalid.");
	});
});
