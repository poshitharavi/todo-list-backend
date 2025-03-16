export interface UserPayload {
  sub: number;
  name: string;
  email: string;
  role: string;
}

export interface LoginResponse {
  name: string;
  email: string;
  token: string;
  role: string;
}
