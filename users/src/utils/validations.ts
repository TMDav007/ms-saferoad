import Joi from "joi";
import { IAccountVerify, ISignup } from "./types";

const validateSignupData = (signup: ISignup) => {
	const signupSchema = Joi.object({
		fullName: Joi.string().min(5).max(30).required(),
		phoneNumber: Joi.string(),
		email: Joi.string().email(),
		NIN: Joi.string().alphanum(),
		WIP: Joi.string().alphanum(),
		password: Joi.string().min(6).max(36),
		confirmPassword: Joi.string().min(6).max(36).valid(Joi.ref("password")),
	})
		.xor("WIP", "NIN", "email", "phoneNumber")
		.and("email", "fullName");

	return signupSchema.validate(signup);
};

const validateAccountVerify = (verifyAccount: IAccountVerify) => {
	const accountVerifySchema = Joi.object({
		otp: Joi.number().required(),
		userId: Joi.string().required(),
	});

	return accountVerifySchema.validate(verifyAccount);
};

export { validateSignupData, validateAccountVerify };
