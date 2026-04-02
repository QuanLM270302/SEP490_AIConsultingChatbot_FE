/** Bilingual labels for tenant permission codes (matches backend authorities). */
export const PERMISSION_LABELS: Record<string, { vi: string; en: string }> = {
  USER_ALL: { vi: "Toàn quyền người dùng", en: "Full user access" },
  USER_READ: { vi: "Xem người dùng", en: "View users" },
  USER_WRITE: { vi: "Thêm/sửa người dùng", en: "Create/update users" },
  USER_DELETE: { vi: "Xóa người dùng", en: "Delete users" },
  ROLE_ALL: { vi: "Toàn quyền vai trò", en: "Full role access" },
  ROLE_READ: { vi: "Xem vai trò", en: "View roles" },
  ROLE_WRITE: { vi: "Thêm/sửa vai trò", en: "Create/update roles" },
  DOCUMENT_ALL: { vi: "Toàn quyền tài liệu", en: "Full document access" },
  DOCUMENT_READ: { vi: "Xem/tải tài liệu", en: "View/download documents" },
  DOCUMENT_WRITE: { vi: "Tải lên/cập nhật tài liệu", en: "Upload/update documents" },
  DOCUMENT_DELETE: { vi: "Xóa tài liệu", en: "Delete documents" },
  ANALYTICS_VIEW: { vi: "Xem phân tích", en: "View analytics" },
  ANALYTICS_EXPORT: { vi: "Xuất báo cáo phân tích", en: "Export analytics" },
  SUBSCRIPTION_READ: { vi: "Xem gói đăng ký", en: "View subscription" },
  SUBSCRIPTION_WRITE: { vi: "Quản lý gói đăng ký", en: "Manage subscription" },
};

export function getPermissionLabel(
  code: string,
  fallbackName: string | undefined,
  lang: "vi" | "en"
): string {
  const row = PERMISSION_LABELS[code];
  if (row) return lang === "en" ? row.en : row.vi;
  return fallbackName?.trim() || code;
}
