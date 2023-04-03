import Joi from "joi";
import { IAccountVerify, ISignin, ISignup } from "./types";

const validateSignupData = (signup: ISignup) => {
  const signupSchema = Joi.object({
    fullName: Joi.string().min(5).max(30).messages({
      "string.base": "Fullname must be a string",
      "string.min": "Fullname must be atleast 5 characters",
      "string.max": "Fullname must not be more than 30 characters",
    }),
    phoneNumber: Joi.string().messages({
      "string.base": "phoneNumber must be a string",
    }),
    email: Joi.string().email().messages({
      "string.base": "email must be a string",
      "string.email": "You must input a valid email",
    }),
    NIN: Joi.string().alphanum().messages({
      "string.base": "NIN must be a string",
    }),
    WID: Joi.string().alphanum().messages({
      "string.base": "WID must be a string",
    }),
    password: Joi.string().min(6).max(36).messages({
      "string.base": "password must be a string",
      "string.min": "password must be atleast 6 characters",
      "string.max": "password must not be more than 36 characters",
    }),
    // confirmPassword: Joi.string().min(6).max(36).valid(Joi.ref("password")),
  })
    .xor("WID", "NIN", "email", "phoneNumber")
    .and("email", "WID", "password")
    .messages({
      "object.missing": "You must add the required input fields to continue",
      "object.xor": "At least an NIN or WID is required",
      "object.and": "email, WID and password are required",
      "object.unknown": "Value inputted is unknown",
    });

  return signupSchema.validate(signup);
};

const validateAccountVerify = (verifyAccount: IAccountVerify) => {
  const accountVerifySchema = Joi.object({
    otp: Joi.number().integer().required().messages({
      "number.base": "otp must be a number",
      "any.required": "otp is required",
    }),
    userId: Joi.string().required().messages({
      "string.base": "userId must be a string",
      "any.required": "userId is required",
    }),
  }).messages({
    "object.unknown": "Value inputted is unknown",
  });

  return accountVerifySchema.validate(verifyAccount);
};

const validateOTP = (otprequest: { email: string }) => {
  const otpSchema = Joi.object({
    email: Joi.string().email().required().messages({
      "string.base": "email must be a string",
      "string.email": "You must input a valid email",
      "any.required": "email is required",
    }),
  }).messages({
    "object.unknown": "Value inputted is unknown",
  });

  return otpSchema.validate(otprequest);
};

const validateSignin = (signin: ISignin) => {
  const signinSchema = Joi.object({
    NIN: Joi.string()
      .alphanum()
      .messages({ "string.base": "NIN must be a string" }),
    WID: Joi.string()
      .alphanum()
      .messages({ "string.base": "WIP must be a string" }),
    password: Joi.string(),
  })
    .xor("WID", "NIN")
    .and("WID", "password")
    .messages({
      "object.missing": "You must add a WID or NIN to continue",
      "object.xor": "WID or NIN is required",
      "object.and": "WID and password are both required",
      "object.unknown": "Value inputted is unknown",
    });

  return signinSchema.validate(signin);
};

export {
  validateSignupData,
  validateOTP,
  validateSignin,
  validateAccountVerify,
};
