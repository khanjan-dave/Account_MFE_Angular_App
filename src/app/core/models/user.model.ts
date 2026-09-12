export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  accountNumber: string;
  balance: number;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  status: string;
  token: string;
  message: string;
  username: string;
  role: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}
