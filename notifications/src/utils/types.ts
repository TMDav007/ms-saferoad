export interface INotification {
  id?: string;
  userId: string;
  message: string;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IMongooseOpts {
    useNewUrlParser: boolean;
    autoReconnect: boolean;
    reconnectTries: number;
    reconnectInterval: number;
  }