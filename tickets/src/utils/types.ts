export interface ITicket {
	id?: string;
	offenderIDNumber: string;
	offenderFullName?: string;
	location: string;
	createdBy: string;
	plateNumber: string;
	offense: string;
	price?: string;
	carType: string;
	carModel: string;
	offenderPhoneNumber?: string;
	offenderEmail?: string;
	evidenceUrl?: string;
	evidenceCloudinaryId?: string;
	gracePeriod?: string;
	status?: string;
	createdAt?: Date;
	updatedAt?: Date;
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
	WIP?: string;
	phoneNumber?: string;
	state?: string;
	error?: string;
}


export interface UserPayload {
	id: string;
	email: string;
	verified: boolean;
	userType: string;
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
