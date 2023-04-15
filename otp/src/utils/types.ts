export interface IOTP {
  id?: string;
  userId: string;
  phoneNumber?: string;
  email?: string;
  otp?: string;
  createdAt?: number;
  expiresAt?: number;
}

export interface IMongooseOpts {
  useNewUrlParser: boolean;
  autoReconnect: boolean;
  reconnectTries: number;
  reconnectInterval: number;
}
