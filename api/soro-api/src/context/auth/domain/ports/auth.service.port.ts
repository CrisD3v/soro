export interface LoginResult {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    lastName: string;
  };
}

export interface TokenPayload {
  sub: string;
  email: string;
  companyId: string;
  roles: string[];
}

export interface RefreshTokenResult {
  accessToken: string;
  refreshToken: string;
}

export abstract class AuthServicePort {
  abstract validateUser(email: string, password: string): Promise<any>;
  abstract login(userId: string): Promise<LoginResult>;
  abstract refreshToken(refreshToken: string): Promise<RefreshTokenResult>;
  abstract logout(userId: string, refreshToken: string): Promise<void>;
  abstract validateToken(token: string): Promise<TokenPayload>;
}
