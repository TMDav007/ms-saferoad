export interface IPayment {
  id?: string;
  userId: string;
  ticketId?: string;
  gatewayReferenceId: string;
  gatewayName?: string;
  amount: number;
  status: string;
}

export interface IMongooseOpts {
    useNewUrlParser: boolean;
    autoReconnect: boolean;
    reconnectTries: number;
    reconnectInterval: number;
  }