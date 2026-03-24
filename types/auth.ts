/** Request body for POST /api/v1/auth/login */
export interface LoginRequest {
  email: string;
  password: string;
}

/** Request body for POST /api/v1/auth/forgot-password */
export interface ForgotPasswordRequest {
  email: string;
}

/** Request body for POST /api/v1/auth/verify-reset-otp */
export interface VerifyResetOtpRequest {
  email: string;
  otp: string;
}

/** 200 từ verify-reset-otp — giữ resetSessionToken trong state, dùng ở reset-password */
export interface VerifyResetOtpResponse extends MessageResponse {
  resetSessionToken: string;
}

/** Request body cho POST /api/v1/auth/reset-password (luồng quên MK — chỉ token + mật khẩu mới) */
export interface ResetPasswordForgotRequest {
  resetSessionToken: string;
  newPassword: string;
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
