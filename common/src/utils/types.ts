
export interface UserPayload {
	id: string;
	email: string;
	verified: boolean;
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