export class AuthResponseDto {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    lastName: string;
  };
}

export class RefreshResponseDto {
  accessToken: string;
  refreshToken: string;
}
