"use client";

import { useState, useEffect } from "react";
import { MoreVertical, Eye, Pencil, Shield, UserCheck, UserX, Key, Trash2, Loader2, X, User, Mail, Building, Calendar, Info } from "lucide-react";
import {
  getTenantUsers,
  getTenantUserById,
  updateTenantUser,
  updateTenantUserPermissions,
  activateTenantUser,
  deactivateTenantUser,
  resetTenantUserPassword,
  deleteTenantUser,
  getTenantAvailablePermissions,
  getTenantDepartments,
  getTenantRoles,
  type UserResponse,
  type UpdateUserRequest,
  type DepartmentResponse,
  type RoleResponse,
} from "@/lib/api/tenant-admin";
import { useLanguageStore } from "@/lib/language-store";
import { translations } from "@/lib/translations";

type StatusFilter = "ACTIVE" | "INACTIVE" | "ALL";

export function EmployeesTable() {
  const { language } = useLanguageStore();
  const t = translations[language];
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ACTIVE");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [detailUser, setDetailUser] = useState<UserResponse | null>(null);
  const [editUser, setEditUser] = useState<UserResponse | null>(null);
  const [permissionsUser, setPermissionsUser] = useState<{ user: UserResponse; permissions: string[] } | null>(null);
  const [availablePermissions, setAvailablePermissions] = useState<{ code: string }[]>([]);

  const loadUsers = () => {
    setLoading(true);
    setError(null);
    getTenantUsers(statusFilter)
      .then(setUsers)
      .catch((e) => setError(e instanceof Error ? e.message : t.errorLoadingData))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadUsers();
  }, [statusFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!openMenuId) return;
    const close = () => {
      setOpenMenuId(null);
      setMenuPos(null);
    };
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [openMenuId]);

  const toggleMenu = (userId: string, anchor: HTMLElement) => {
    if (openMenuId === userId) {
      setOpenMenuId(null);
      setMenuPos(null);
      return;
    }
    const rect = anchor.getBoundingClientRect();
    const menuWidth = 208;
    const margin = 12;
    const left = Math.min(
      Math.max(rect.right - menuWidth, margin),
      window.innerWidth - margin - menuWidth
    );
    setMenuPos({ top: rect.bottom + 6, left });
    setOpenMenuId(userId);
  };

  const handleActivate = (userId: string) => {
    setOpenMenuId(null);
    setMenuPos(null);
    setActionLoading(userId);
    activateTenantUser(userId)
      .then(loadUsers)
      .catch((e) => alert(e instanceof Error ? e.message : "Lỗi"))
      .finally(() => setActionLoading(null));
  };

  const handleDeactivate = (userId: string) => {
    setOpenMenuId(null);
    setMenuPos(null);
    setActionLoading(userId);
    deactivateTenantUser(userId)
      .then(loadUsers)
      .catch((e) => alert(e instanceof Error ? e.message : "Lỗi"))
      .finally(() => setActionLoading(null));
  };

  const handleResetPassword = (userId: string) => {
    setOpenMenuId(null);
    setMenuPos(null);
    setActionLoading(userId);
    resetTenantUserPassword(userId)
      .then(() => alert(t.passwordResetSent))
      .catch((e) => alert(e instanceof Error ? e.message : "Lỗi"))
      .finally(() => setActionLoading(null));
  };

  const handleDelete = (userId: string) => {
    if (!confirm(t.confirmDeleteUser)) return;
    setOpenMenuId(null);
    setMenuPos(null);
    setActionLoading(userId);
    deleteTenantUser(userId)
      .then(loadUsers)
      .catch((e) => alert(e instanceof Error ? e.message : "Lỗi"))
      .finally(() => setActionLoading(null));
  };

  const handleViewDetail = (userId: string) => {
    setOpenMenuId(null);
    setMenuPos(null);
    getTenantUserById(userId)
      .then(setDetailUser)
      .catch((e) => alert(e instanceof Error ? e.message : "Lỗi"));
  };

  const openEdit = (user: UserResponse) => {
    setOpenMenuId(null);
    setMenuPos(null);
    setEditUser(user);
  };

  const openPermissions = (user: UserResponse) => {
    setOpenMenuId(null);
    setMenuPos(null);
    getTenantAvailablePermissions()
      .then((list) => {
        setAvailablePermissions(list);
        setPermissionsUser({ user, permissions: [] });
      })
      .catch((e) => alert(e instanceof Error ? e.message : "Lỗi tải danh sách quyền"));
  };

  const handleSaveEdit = async (userId: string, body: UpdateUserRequest) => {
    setActionLoading(userId);
    try {
      await updateTenantUser(userId, body);
      setEditUser(null);
      loadUsers();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Lỗi");
    } finally {
      setActionLoading(null);
    }
  };

  const handleSavePermissions = async () => {
    if (!permissionsUser) return;
    setActionLoading(permissionsUser.user.id);
    try {
      await updateTenantUserPermissions(permissionsUser.user.id, permissionsUser.permissions);
      setPermissionsUser(null);
      loadUsers();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Lỗi");
    } finally {
      setActionLoading(null);
    }
  };

  const isActive = (u: UserResponse | null | undefined) => {
    if (typeof u?.isActive === "boolean") return u.isActive;
    return ((u?.status ?? "").toUpperCase() !== "INACTIVE");
  };

  if (loading) {
    return (
      <div className="overflow-hidden rounded-3xl bg-white p-8 shadow-lg dark:bg-zinc-950">
        <p className="text-sm text-zinc-500">{t.loadingEmployees}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="overflow-hidden rounded-3xl bg-white p-8 shadow-lg dark:bg-zinc-950">
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-4">
        {(["ACTIVE", "INACTIVE", "ALL"] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStatusFilter(s)}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
              statusFilter === s
                ? "bg-purple-500 text-white"
                : "bg-white text-zinc-600 hover:bg-zinc-100 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800"
            }`}
          >
            {s === "ALL" ? t.all : s === "ACTIVE" ? (language === "en" ? "Active" : "Đang hoạt động") : (language === "en" ? "Inactive" : "Vô hiệu hóa")}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-3xl bg-white shadow-lg shadow-purple-100/60 dark:bg-zinc-950 dark:shadow-black/40">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-zinc-100 dark:divide-zinc-900">
            <thead className="bg-zinc-50 dark:bg-zinc-900">
              <tr>
                <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400">{t.name}</th>
                <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400">{t.email}</th>
                <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400">{t.department}</th>
                <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400">{t.role}</th>
                <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400">{t.status}</th>
                <th className="relative px-6 py-4"><span className="sr-only">{t.actions}</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 bg-white dark:divide-zinc-900 dark:bg-zinc-950">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-sm text-zinc-500">
                    {t.noEmployees}
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="transition hover:bg-zinc-50 dark:hover:bg-zinc-900">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-zinc-900 dark:text-white">{user.fullName ?? "—"}</td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-xs text-zinc-600 dark:text-zinc-400">{user.email ?? "—"}</div>
                      {user.contactEmail ? (
                        <div className="mt-0.5 text-[11px] text-zinc-500 dark:text-zinc-500">
                          Contact: {user.contactEmail}
                        </div>
                      ) : null}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-900 dark:text-white">{user.departmentName ?? "—"}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-900 dark:text-white">{user.roleName ?? "—"}</td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${isActive(user) ? "bg-purple-500/10 text-purple-600 dark:text-purple-400" : "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400"}`}>
                        {isActive(user) ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="relative whitespace-nowrap px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={(e) => toggleMenu(user.id, e.currentTarget)}
                        className="rounded-full p-1.5 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-500 dark:hover:bg-zinc-900"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                      {actionLoading === user.id && (
                        <span className="absolute right-8 top-1/2 -translate-y-1/2">
                          <Loader2 className="h-4 w-4 animate-spin text-purple-500" />
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {openMenuId && menuPos && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => {
              setOpenMenuId(null);
              setMenuPos(null);
            }}
          />
          <div
            className="fixed z-50 w-52 rounded-xl border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-900"
            style={{ top: menuPos.top, left: menuPos.left }}
          >
            <button
              type="button"
              onClick={() => handleViewDetail(openMenuId)}
              className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <Eye className="h-4 w-4" /> {t.viewDetail}
            </button>
            <button
              type="button"
              onClick={() => {
                const selected = users.find((u) => u.id === openMenuId);
                if (selected) openEdit(selected);
              }}
              className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <Pencil className="h-4 w-4" /> {t.updateUserInfo}
            </button>
            <button
              type="button"
              onClick={() => {
                const selected = users.find((u) => u.id === openMenuId);
                if (selected) openPermissions(selected);
              }}
              className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <Shield className="h-4 w-4" /> {t.updateUserPermissions}
            </button>
            {isActive(users.find((u) => u.id === openMenuId)) ? (
              <button
                type="button"
                onClick={() => handleDeactivate(openMenuId)}
                disabled={!!actionLoading}
                className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-amber-700 hover:bg-amber-50 disabled:opacity-60 dark:text-amber-400 dark:hover:bg-amber-950/30"
              >
                <UserX className="h-4 w-4" /> {language === "en" ? "Deactivate" : "Vô hiệu hóa"}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleActivate(openMenuId)}
                disabled={!!actionLoading}
                className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-purple-700 hover:bg-purple-50 disabled:opacity-60 dark:text-purple-400 dark:hover:bg-purple-950/30"
              >
                <UserCheck className="h-4 w-4" /> {language === "en" ? "Activate" : "Kích hoạt"}
              </button>
            )}
            <button
              type="button"
              onClick={() => handleResetPassword(openMenuId)}
              disabled={!!actionLoading}
              className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-100 disabled:opacity-60 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <Key className="h-4 w-4" /> {language === "en" ? "Reset password" : "Reset mật khẩu"}
            </button>
            <button
              type="button"
              onClick={() => handleDelete(openMenuId)}
              disabled={!!actionLoading}
              className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 disabled:opacity-60 dark:text-red-400 dark:hover:bg-red-950/30"
            >
              <Trash2 className="h-4 w-4" /> {t.deleteUser}
            </button>
          </div>
        </>
      )}

      {detailUser && (
        <DetailModal user={detailUser} onClose={() => setDetailUser(null)} />
      )}

      {editUser && (
        <EditUserModal
          user={editUser}
          onClose={() => setEditUser(null)}
          onSave={(body) => handleSaveEdit(editUser.id, body)}
          loading={actionLoading === editUser.id}
        />
      )}

      {permissionsUser && (
        <PermissionsModal
          user={permissionsUser.user}
          permissions={permissionsUser.permissions}
          available={availablePermissions}
          onChange={(perms) => setPermissionsUser((p) => p ? { ...p, permissions: perms } : null)}
          onSave={handleSavePermissions}
          onClose={() => setPermissionsUser(null)}
          loading={!!actionLoading}
        />
      )}
    </>
  );
}


function DetailModal({ user, onClose }: { user: UserResponse; onClose: () => void }) {
  const { language } = useLanguageStore();
  const t = translations[language];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="absolute inset-0 bg-zinc-900/60" onClick={onClose} />
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl dark:bg-zinc-950">
        <div className="relative overflow-hidden rounded-t-3xl bg-gradient-to-br from-purple-500 to-violet-600 px-6 py-8">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30" />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 shadow-lg backdrop-blur-sm">
                <User className="h-7 w-7 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">{t.userDetail}</h3>
                <p className="mt-1 text-sm text-purple-100">{language === "en" ? "Employee Information" : "Thông tin nhân viên"}</p>
              </div>
            </div>
            <button type="button" onClick={onClose} className="rounded-xl bg-white/10 p-2 text-white backdrop-blur-sm transition hover:bg-white/20">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="space-y-4 p-6">
          <div className="rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50/50 to-white p-5 dark:border-purple-900/30 dark:from-purple-950/20 dark:to-zinc-950">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10">
                <User className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <h4 className="font-semibold text-zinc-900 dark:text-white">{language === "en" ? "User Information" : "Thông tin người dùng"}</h4>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/30">
                  <User className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{t.fullName}</p>
                  <p className="mt-0.5 text-sm font-medium text-zinc-900 dark:text-white">{user.fullName ?? "—"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/30">
                  <Info className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{t.status}</p>
                  <p className="mt-0.5">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${(user.isActive || (user.status ?? "").toUpperCase() !== "INACTIVE") ? "bg-purple-500/10 text-purple-600 dark:text-purple-400" : "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400"}`}>
                      {(user.isActive || (user.status ?? "").toUpperCase() !== "INACTIVE") ? "Active" : "Inactive"}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50/50 to-white p-5 dark:border-purple-900/30 dark:from-purple-950/20 dark:to-zinc-950">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10">
                <Mail className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <h4 className="font-semibold text-zinc-900 dark:text-white">{language === "en" ? "Contact Information" : "Thông tin liên hệ"}</h4>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/30">
                  <Mail className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{t.email}</p>
                  <p className="mt-0.5 truncate text-sm font-medium text-zinc-900 dark:text-white">{user.email ?? "—"}</p>
                </div>
              </div>
              {user.contactEmail && (
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/30">
                    <Mail className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{t.contactEmail}</p>
                    <p className="mt-0.5 truncate text-sm font-medium text-zinc-900 dark:text-white">{user.contactEmail}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50/50 to-white p-5 dark:border-purple-900/30 dark:from-purple-950/20 dark:to-zinc-950">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10">
                <Building className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <h4 className="font-semibold text-zinc-900 dark:text-white">{language === "en" ? "Organization Information" : "Thông tin tổ chức"}</h4>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/30">
                  <Building className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{t.department}</p>
                  <p className="mt-0.5 text-sm font-medium text-zinc-900 dark:text-white">{user.departmentName ?? "—"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/30">
                  <User className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{t.role}</p>
                  <p className="mt-0.5 text-sm font-medium text-zinc-900 dark:text-white">{user.roleName ?? "—"}</p>
                </div>
              </div>
            </div>
          </div>

          {user.createdAt && (
            <div className="rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50/50 to-white p-5 dark:border-purple-900/30 dark:from-purple-950/20 dark:to-zinc-950">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10">
                  <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <h4 className="font-semibold text-zinc-900 dark:text-white">{language === "en" ? "System Information" : "Thông tin hệ thống"}</h4>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/30">
                    <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{language === "en" ? "Created Date" : "Ngày tạo"}</p>
                    <p className="mt-0.5 text-sm font-medium text-zinc-900 dark:text-white">
                      {new Date(user.createdAt).toLocaleString(language === 'vi' ? 'vi-VN' : 'en-US')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-zinc-200 px-6 py-4 dark:border-zinc-800">
          <button type="button" onClick={onClose} className="w-full rounded-xl bg-purple-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/30 transition hover:bg-purple-600">
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
}


function EditUserModal({ user, onClose, onSave, loading }: { user: UserResponse; onClose: () => void; onSave: (body: UpdateUserRequest) => void; loading: boolean; }) {
  const { language } = useLanguageStore();
  const t = translations[language];
  const [fullName, setFullName] = useState(user.fullName ?? "");
  const [departmentId, setDepartmentId] = useState<number | "">(user.departmentId ?? "");
  const [roleId, setRoleId] = useState<number | "">(user.roleId ?? "");
  const [departments, setDepartments] = useState<DepartmentResponse[]>([]);
  const [roles, setRoles] = useState<RoleResponse[]>([]);
  const [metaLoading, setMetaLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const loadData = async () => {
      if (cancelled) return;
      setMetaLoading(true);
      try {
        const [depts, r] = await Promise.all([
          getTenantDepartments().catch(() => []),
          getTenantRoles().catch(() => [])
        ]);
        if (!cancelled) {
          setDepartments(depts);
          setRoles(r);
        }
      } finally {
        if (!cancelled) setMetaLoading(false);
      }
    };
    loadData();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-zinc-900/60" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-xl dark:bg-zinc-950">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white">{t.updateUserInfo}</h3>
        <div className="mt-4 space-y-3">
          <div>
            <label className="block text-xs font-medium text-zinc-500">{t.fullName}</label>
            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-white" />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500">{t.department}</label>
            <select value={departmentId} onChange={(e) => setDepartmentId(e.target.value === "" ? "" : Number(e.target.value))} className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-white">
              <option value="">—</option>
              {departments.map((d) => (<option key={d.id} value={d.id}>{d.name ?? `Department #${d.id}`}</option>))}
            </select>
            {metaLoading && <p className="mt-1 text-xs text-zinc-500">{t.loadingDepartments}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500">{t.role}</label>
            <select value={roleId} onChange={(e) => setRoleId(e.target.value === "" ? "" : Number(e.target.value))} className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-white">
              <option value="">—</option>
              {roles.map((r) => (<option key={r.id} value={r.id}>{r.name ?? `Role #${r.id}`}</option>))}
            </select>
            {metaLoading && <p className="mt-1 text-xs text-zinc-500">{language === "en" ? "Loading roles..." : "Đang tải danh sách vai trò..."}</p>}
          </div>
        </div>
        <div className="mt-6 flex gap-2">
          <button type="button" onClick={() => onSave({ fullName, departmentId: departmentId === "" ? undefined : departmentId, roleId: roleId === "" ? undefined : roleId })} disabled={loading} className="rounded-xl bg-purple-500 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-600 disabled:opacity-50">
            {loading ? <Loader2 className="h-4 w-4 animate-spin inline" /> : t.save}
          </button>
          <button type="button" onClick={onClose} className="rounded-xl border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 dark:border-zinc-700 dark:text-zinc-300">{t.cancel}</button>
        </div>
      </div>
    </div>
  );
}


function PermissionsModal({ user, permissions, available, onChange, onSave, onClose, loading }: { user: UserResponse; permissions: string[]; available: { code: string }[]; onChange: (perms: string[]) => void; onSave: () => void; onClose: () => void; loading: boolean; }) {
  const { language } = useLanguageStore();
  const t = translations[language];
  const toggle = (code: string) => { if (permissions.includes(code)) onChange(permissions.filter((p) => p !== code)); else onChange([...permissions, code]); };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-zinc-900/60" onClick={onClose} />
      <div className="relative max-h-[80vh] w-full max-w-md overflow-auto rounded-3xl bg-white p-6 shadow-xl dark:bg-zinc-950">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white">{t.updateUserPermissions}: {user.fullName ?? user.email}</h3>
        <p className="mt-1 text-xs text-zinc-500">{language === "en" ? "Select additional permissions for this user." : "Chọn các quyền bổ sung cho user."}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {available.map(({ code }) => (
            <label key={code} className="flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700">
              <input type="checkbox" checked={permissions.includes(code)} onChange={() => toggle(code)} className="rounded text-purple-500" />
              <span className="text-zinc-800 dark:text-zinc-200">{code}</span>
            </label>
          ))}
        </div>
        {available.length === 0 && <p className="text-sm text-zinc-500">{t.noPermissions}</p>}
        <div className="mt-6 flex gap-2">
          <button type="button" onClick={onSave} disabled={loading} className="rounded-xl bg-purple-500 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-600 disabled:opacity-50">
            {loading ? <Loader2 className="h-4 w-4 animate-spin inline" /> : t.save}
          </button>
          <button type="button" onClick={onClose} className="rounded-xl border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 dark:border-zinc-700 dark:text-zinc-300">{t.cancel}</button>
        </div>
      </div>
    </div>
  );
}
