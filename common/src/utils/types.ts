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
