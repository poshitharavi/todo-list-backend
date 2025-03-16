export interface UserPayload {
  sub: number;
  name: string;
  email: string;
}

export interface LoginResponse {
  name: string;
  email: string;
  token: string;
}
