/** Response from GET /api/v1/profile/me */
export interface UserProfileResponse {
  id: string;
  email: string;
  contactEmail: string | null;
  fullName: string;
  phoneNumber: string | null;
  dateOfBirth: string | null; // ISO date "YYYY-MM-DD"
  address: string | null;
  roleName: string | null;
  departmentName: string | null;
  tenantName: string | null;
  createdAt: string; // ISO datetime
  updatedAt: string | null;
  lastLoginAt: string | null;
}

/** Request body for PUT /api/v1/profile/update */
export interface UpdateProfileRequest {
  phoneNumber?: string | null;
  dateOfBirth?: string | null; // "YYYY-MM-DD"
  address?: string | null;
}

/** Request body for POST /api/v1/profile/change-password */
export interface ChangePasswordRequest {
  oldPassword?: string | null; // Optional when mustChangePassword is true
  newPassword: string;
}
