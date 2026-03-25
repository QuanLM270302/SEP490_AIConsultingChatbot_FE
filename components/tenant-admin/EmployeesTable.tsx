"use client";

import { useState, useEffect } from "react";
import { MoreVertical, Eye, Pencil, Shield, UserCheck, UserX, Key, Trash2, Loader2 } from "lucide-react";
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
    const menuWidth = 208; // w-52
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
      .then(() => alert("Mật khẩu mới đã được gửi đến email của user."))
      .catch((e) => alert(e instanceof Error ? e.message : "Lỗi"))
      .finally(() => setActionLoading(null));
  };

  const handleDelete = (userId: string) => {
    if (!confirm("Bạn có chắc muốn xóa (vô hiệu hóa) user này?")) return;
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
        <p className="text-sm text-zinc-500">Đang tải danh sách nhân viên…</p>
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
                ? "bg-green-500 text-white"
                : "bg-white text-zinc-600 hover:bg-zinc-100 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800"
            }`}
          >
            {s === "ALL" ? "Tất cả" : s === "ACTIVE" ? "Đang hoạt động" : "Vô hiệu hóa"}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-3xl bg-white shadow-lg shadow-green-100/60 dark:bg-zinc-950 dark:shadow-black/40">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-zinc-100 dark:divide-zinc-900">
            <thead className="bg-zinc-50 dark:bg-zinc-900">
              <tr>
                <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400">Name</th>
                <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400">Email</th>
                <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400">Department</th>
                <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400">Role</th>
                <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400">Status</th>
                <th className="relative px-6 py-4"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 bg-white dark:divide-zinc-900 dark:bg-zinc-950">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-sm text-zinc-500">
                    Chưa có nhân viên. Dữ liệu được tải từ server.
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
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${isActive(user) ? "bg-green-500/10 text-green-600 dark:text-green-400" : "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400"}`}>
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
                          <Loader2 className="h-4 w-4 animate-spin text-green-500" />
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
              <Eye className="h-4 w-4" /> Xem chi tiết
            </button>
            <button
              type="button"
              onClick={() => {
                const selected = users.find((u) => u.id === openMenuId);
                if (selected) openEdit(selected);
              }}
              className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <Pencil className="h-4 w-4" /> Cập nhật thông tin
            </button>
            <button
              type="button"
              onClick={() => {
                const selected = users.find((u) => u.id === openMenuId);
                if (selected) openPermissions(selected);
              }}
              className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <Shield className="h-4 w-4" /> Cập nhật quyền
            </button>
            {isActive(users.find((u) => u.id === openMenuId)) ? (
              <button
                type="button"
                onClick={() => handleDeactivate(openMenuId)}
                disabled={!!actionLoading}
                className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-amber-700 hover:bg-amber-50 disabled:opacity-60 dark:text-amber-400 dark:hover:bg-amber-950/30"
              >
                <UserX className="h-4 w-4" /> Vô hiệu hóa
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleActivate(openMenuId)}
                disabled={!!actionLoading}
                className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-green-700 hover:bg-green-50 disabled:opacity-60 dark:text-green-400 dark:hover:bg-green-950/30"
              >
                <UserCheck className="h-4 w-4" /> Kích hoạt
              </button>
            )}
            <button
              type="button"
              onClick={() => handleResetPassword(openMenuId)}
              disabled={!!actionLoading}
              className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-100 disabled:opacity-60 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <Key className="h-4 w-4" /> Reset mật khẩu
            </button>
            <button
              type="button"
              onClick={() => handleDelete(openMenuId)}
              disabled={!!actionLoading}
              className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 disabled:opacity-60 dark:text-red-400 dark:hover:bg-red-950/30"
            >
              <Trash2 className="h-4 w-4" /> Xóa user
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
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-zinc-900/60" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-xl dark:bg-zinc-950">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Chi tiết user</h3>
        <dl className="mt-4 space-y-2 text-sm">
          <div><dt className="text-zinc-500">Họ tên</dt><dd className="font-medium text-zinc-900 dark:text-white">{user.fullName ?? "—"}</dd></div>
          <div><dt className="text-zinc-500">Email</dt><dd className="font-medium text-zinc-900 dark:text-white">{user.email ?? "—"}</dd></div>
          <div><dt className="text-zinc-500">Contact email</dt><dd className="font-medium text-zinc-900 dark:text-white">{user.contactEmail ?? "—"}</dd></div>
          <div><dt className="text-zinc-500">Phòng ban</dt><dd className="font-medium text-zinc-900 dark:text-white">{user.departmentName ?? "—"}</dd></div>
          <div><dt className="text-zinc-500">Vai trò</dt><dd className="font-medium text-zinc-900 dark:text-white">{user.roleName ?? "—"}</dd></div>
          <div><dt className="text-zinc-500">Trạng thái</dt><dd className="font-medium text-zinc-900 dark:text-white">{user.status ?? "—"}</dd></div>
          <div><dt className="text-zinc-500">Ngày tạo</dt><dd className="font-medium text-zinc-900 dark:text-white">{user.createdAt ? new Date(user.createdAt).toLocaleDateString("vi-VN") : "—"}</dd></div>
        </dl>
        <button type="button" onClick={onClose} className="mt-6 rounded-xl bg-zinc-200 px-4 py-2 text-sm font-medium text-zinc-800 dark:bg-zinc-700 dark:text-zinc-200">Đóng</button>
      </div>
    </div>
  );
}

function EditUserModal({
  user,
  onClose,
  onSave,
  loading,
}: {
  user: UserResponse;
  onClose: () => void;
  onSave: (body: UpdateUserRequest) => void;
  loading: boolean;
}) {
  const [fullName, setFullName] = useState(user.fullName ?? "");
  const [departmentId, setDepartmentId] = useState<number | "">(user.departmentId ?? "");
  const [roleId, setRoleId] = useState<number | "">(user.roleId ?? "");
  const [departments, setDepartments] = useState<DepartmentResponse[]>([]);
  const [roles, setRoles] = useState<RoleResponse[]>([]);
  const [metaLoading, setMetaLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setMetaLoading(true);
    Promise.all([
      getTenantDepartments().catch(() => []),
      getTenantRoles().catch(() => []),
    ])
      .then(([depts, r]) => {
        if (cancelled) return;
        setDepartments(depts);
        setRoles(r);
      })
      .finally(() => {
        if (!cancelled) setMetaLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-zinc-900/60" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-xl dark:bg-zinc-950">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Cập nhật thông tin user</h3>
        <div className="mt-4 space-y-3">
          <div>
            <label className="block text-xs font-medium text-zinc-500">Họ tên</label>
            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-white" />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500">Phòng ban</label>
            <select
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value === "" ? "" : Number(e.target.value))}
              className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
            >
              <option value="">—</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name ?? `Department #${d.id}`}
                </option>
              ))}
            </select>
            {metaLoading && <p className="mt-1 text-xs text-zinc-500">Đang tải danh sách phòng ban…</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500">Vai trò</label>
            <select
              value={roleId}
              onChange={(e) => setRoleId(e.target.value === "" ? "" : Number(e.target.value))}
              className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
            >
              <option value="">—</option>
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name ?? `Role #${r.id}`}
                </option>
              ))}
            </select>
            {metaLoading && <p className="mt-1 text-xs text-zinc-500">Đang tải danh sách vai trò…</p>}
          </div>
        </div>
        <div className="mt-6 flex gap-2">
          <button type="button" onClick={() => onSave({ fullName, departmentId: departmentId === "" ? undefined : departmentId, roleId: roleId === "" ? undefined : roleId })} disabled={loading} className="rounded-xl bg-green-500 px-4 py-2 text-sm font-semibold text-white hover:bg-green-600 disabled:opacity-50">
            {loading ? <Loader2 className="h-4 w-4 animate-spin inline" /> : "Lưu"}
          </button>
          <button type="button" onClick={onClose} className="rounded-xl border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 dark:border-zinc-700 dark:text-zinc-300">Hủy</button>
        </div>
      </div>
    </div>
  );
}

function PermissionsModal({
  user,
  permissions,
  available,
  onChange,
  onSave,
  onClose,
  loading,
}: {
  user: UserResponse;
  permissions: string[];
  available: { code: string }[];
  onChange: (perms: string[]) => void;
  onSave: () => void;
  onClose: () => void;
  loading: boolean;
}) {
  const toggle = (code: string) => {
    if (permissions.includes(code)) onChange(permissions.filter((p) => p !== code));
    else onChange([...permissions, code]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-zinc-900/60" onClick={onClose} />
      <div className="relative max-h-[80vh] w-full max-w-md overflow-auto rounded-3xl bg-white p-6 shadow-xl dark:bg-zinc-950">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Cập nhật quyền: {user.fullName ?? user.email}</h3>
        <p className="mt-1 text-xs text-zinc-500">Chọn các quyền bổ sung cho user.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {available.map(({ code }) => (
            <label key={code} className="flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700">
              <input type="checkbox" checked={permissions.includes(code)} onChange={() => toggle(code)} className="rounded text-green-500" />
              <span className="text-zinc-800 dark:text-zinc-200">{code}</span>
            </label>
          ))}
        </div>
        {available.length === 0 && <p className="text-sm text-zinc-500">Không có danh sách quyền.</p>}
        <div className="mt-6 flex gap-2">
          <button type="button" onClick={onSave} disabled={loading} className="rounded-xl bg-green-500 px-4 py-2 text-sm font-semibold text-white hover:bg-green-600 disabled:opacity-50">
            {loading ? <Loader2 className="h-4 w-4 animate-spin inline" /> : "Lưu"}
          </button>
          <button type="button" onClick={onClose} className="rounded-xl border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 dark:border-zinc-700 dark:text-zinc-300">Hủy</button>
        </div>
      </div>
    </div>
  );
}
