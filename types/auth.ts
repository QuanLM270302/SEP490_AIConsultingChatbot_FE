/** Request body for POST /api/v1/auth/login */
export interface LoginRequest {
  email: string;
  password: string;
}

/** Request body for POST /api/v1/auth/forgot-password */
export interface ForgotPasswordRequest {
  email: string;
}

/** Response from login and refresh */
export interface JwtResponse {
  accessToken: string;
  refreshToken: string;
  id: string;
  email: string;
  tenantId: string;
  roles: string[];
  mustChangePassword: boolean;
}

/** Generic message response */
export interface MessageResponse {
  message: string;
}
