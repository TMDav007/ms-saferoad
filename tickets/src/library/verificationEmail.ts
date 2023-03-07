import { Response, NextFunction } from "express";
import { generateOTP } from "./generateOTP";
import { encryptPassword } from "./encryptPassword";
import UserVerification from "../models/UserVerification";
import mailTransporter from "./mailTransporter";
import mongoose from "mongoose";

interface verifyMail {
	_id: string;
	email: string;
}

const sendVerificationMail = async (
	{ _id, email }: verifyMail,
	_res: Response,
	next: NextFunction
) => {
	const session = await mongoose.startSession();
	await session.startTransaction();
	try {
		const otp = generateOTP(6);
		const currentUrl = "http://locallhost:9090";
		const html = `
        <p> Verify your email address to complete your registration.</p> <br />
        <p>This is the code: <p> <b><h3> ${otp}</h3> </b></p> <br />
        <p><b><This code expires in 15 minutes.<b><p>
        <br/>
        <p>if you don't recognize ${email}, you can safely ignore this mail </>
    `;

		const hashedOTP = await encryptPassword(otp.toString());

		const newUserVerification = new UserVerification({
			userId: _id,
			otp: hashedOTP,
			createdAt: Date.now(),
			expiresAt: Date.now() + 60 * 15,
		});

		await newUserVerification.save();
		mailTransporter({
			to: email,
			subject: "Account verification code",
			html: html,
		});
		await session.commitTransaction();
		await session.endSession();

		return;
	} catch (error) {
		await session.abortTransaction();
		await session.endSession();
		next(error);
	}
};

export default sendVerificationMail;
