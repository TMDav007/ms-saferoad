import { Types } from "mongoose";

export interface IUserTypes {
  userId: Types.ObjectId;
  userType: string;
  createdAt: Date;
}

export interface ITicket {
  id: string;
  offenderIDNumber: string;
  offenderName: string;
  createdBy: string;
  plateNumber: string;
  offense: string;
  price: string;
  carType: string;
  carModel: string;
  offenderPhoneNumber: string;
  evidenceUrl?: string;
  evidenceCloudinaryId?: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUser {
  id: string;
  fullName?: string;
  email?: string;
  password?: string;
  NIN?: string;
  plateNumber?: string;
  WID?: string;
  phoneNumber?: string;
  address?: string;
  state?: string;
  verified?: boolean;
  status: string;
  isSignup: Boolean;
  userType: string;
  ticket: Array<ITicket>;
  confirmationCode: string;
  passwordResetExpires: Date;
  profileIconUrl: string;
  profileIconCloudinaryId: string;
}

export interface NINDummyData {
  fullName?: string;
  NIN?: string;
  email?: string;
  phoneNumber?: string;
  plateNumber?: string;
  error?: string;
}

export interface IPoliceDummyData {
  fullName?: string;
  WID?: string;
  phoneNumber?: string;
  email?: string;
  state?: string;
  error?: string;
}

export interface ISignup {
  fullName?: string;
  phoneNumber?: string;
  email?: string;
  NIN?: string;
  WID?: string;
  password: string;
  confirmPassword: string;
}

export interface IMongooseOpts {
  useNewUrlParser: boolean;
  autoReconnect: boolean;
  reconnectTries: number;
  reconnectInterval: number;
}

export interface IAccountVerify {
  userId: string;
  otp: string;
  createdAt?: Number;
  expiresAt?: Date;
}

export interface ISignin {
  NIN?: string;
  WID?: string;
  password?: string;
}

export interface UserPayload {
  id: string;
  email: string;
  verified: boolean;
  userType: string;
}

export interface JWTPayload {
  id?: string;
  userId: string;
  fullName: string;
  phoneNumber?: string;
  email?: string;
  verified: boolean;
  status: string;
  WID?: string;
  NIN?: string;
  isSignup: boolean;
  userType: string;
}

export interface JTPayload {
  userId: string;
  fullName: string;
  phoneNumber?: string;
  email?: string;
  verified: boolean;
  status: string;
  isSignup: boolean;
  userType: string;
}

export interface JwtPayload {
  [key: string]: any;
  id?: string;
  currentUser: string;
  email: string;
  verified: boolean;
  jwt?: string;
  sub?: string | undefined;
  exp?: number | undefined;
  nbf?: number | undefined;
  iat?: number | undefined;
}
