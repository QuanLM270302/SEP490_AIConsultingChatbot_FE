export const AUTH_SESSION_EXPIRED_EVENT = "auth:session-expired";

export type AuthSessionExpiredDetail = {
  status?: number;
  message?: string;
  sourceUrl?: string;
  method?: string;
};

function normalizeText(value: string): string {
  return value
    .toLocaleLowerCase("vi-VN")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function isAuthExpiredErrorMessage(rawMessage: string | null | undefined): boolean {
  if (!rawMessage) return false;
  const message = normalizeText(rawMessage);

  return (
    message.includes("unauthorized") ||
    message.includes("invalid token") ||
    message.includes("missing or invalid token") ||
    message.includes("token expired") ||
    message.includes("phien dang nhap") ||
    message.includes("het han") ||
    message.includes("khong hop le")
  );
}

export function notifyAuthSessionExpired(detail: AuthSessionExpiredDetail): void {
  if (typeof window === "undefined") return;

  window.dispatchEvent(
    new CustomEvent<AuthSessionExpiredDetail>(AUTH_SESSION_EXPIRED_EVENT, {
      detail,
    })
  );
}