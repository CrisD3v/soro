export class AuthResponseDto {
  user: {
    id: string;
    email: string;
    name: string;
    lastName: string;
  };
}

export class RefreshResponseDto {
  message: string;
}
