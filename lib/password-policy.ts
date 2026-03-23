/** Giống ChangePasswordRequest / regex BE */
export const NEW_PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^])[A-Za-z\d@$!%*?&#^]{8,}$/;

export const PASSWORD_HINT_VI =
  "Mật khẩu từ 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt (@$!%?&#^).";

/** Trả về message tiếng Việt nếu không hợp lệ; null nếu ok */
export function getNewPasswordValidationMessage(password: string): string | null {
  if (!password) return PASSWORD_HINT_VI;
  if (!NEW_PASSWORD_REGEX.test(password)) return PASSWORD_HINT_VI;
  return null;
}

/** resetSessionToken từ verify-reset-otp — dạng UUID */
export const RESET_SESSION_TOKEN_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isValidResetSessionToken(token: string): boolean {
  const t = token.trim();
  return t.length > 0 && RESET_SESSION_TOKEN_REGEX.test(t);
}
