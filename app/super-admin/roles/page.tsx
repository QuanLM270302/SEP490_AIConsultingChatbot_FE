"use client";

import { useEffect, useState } from "react";
import { SuperAdminLayout } from "@/components/super-admin/SuperAdminLayout";
import {
  createAdminRole,
  deleteAdminRole,
  getAdminRoleById,
  getAdminRoles,
  updateAdminRole,
  type AdminRoleResponse,
  type CreateAdminRoleRequest,
} from "@/lib/api/admin";
import { Eye, Loader2, MoreVertical, Pencil, Plus, Search, Shield, Trash2 } from "lucide-react";

export default function SuperAdminRolesPage() {
  const [list, setList] = useState<AdminRoleResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [detail, setDetail] = useState<AdminRoleResponse | null>(null);
  const [editRole, setEditRole] = useState<AdminRoleResponse | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(null);

  const load = () => {
    setLoading(true);
    setError(null);
    getAdminRoles()
      .then(setList)
      .catch((e) => setError(e instanceof Error ? e.message : "Lỗi tải roles"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

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

  const toggleMenu = (roleId: number, anchor: HTMLElement) => {
    if (openMenuId === roleId) {
      setOpenMenuId(null);
      setMenuPos(null);
      return;
    }
    const rect = anchor.getBoundingClientRect();
    const menuWidth = 200;
    const margin = 12;
    const left = Math.min(Math.max(rect.right - menuWidth, margin), window.innerWidth - menuWidth - margin);
    setMenuPos({ top: rect.bottom + 6, left });
    setOpenMenuId(roleId);
  };

  const onView = async (roleId: number) => {
    setOpenMenuId(null);
    setMenuPos(null);
    try {
      const data = await getAdminRoleById(roleId);
      setDetail(data);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Không thể lấy chi tiết role");
    }
  };

  const onDelete = async (role: AdminRoleResponse) => {
    if (role.isSystemRole) {
      alert("Không thể xóa system role.");
      return;
    }
    if (!confirm(`Bạn có chắc muốn xóa role "${role.name ?? role.code ?? role.id}"?`)) return;
    setOpenMenuId(null);
    setMenuPos(null);
    setActionLoadingId(role.id);
    try {
      await deleteAdminRole(role.id);
      load();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Xóa role thất bại");
    } finally {
      setActionLoadingId(null);
    }
  };

  const filtered = search.trim()
    ? list.filter((r) =>
        `${r.name ?? ""} ${r.code ?? ""} ${r.tenantName ?? ""}`.toLowerCase().includes(search.toLowerCase())
      )
    : list;

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Role Management</h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Quản lý role và phân quyền hệ thống tại Super Admin
            </p>
          </div>
          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600"
          >
            <Plus className="h-4 w-4" />
            Tạo role mới
          </button>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="border-b border-zinc-200 p-4 dark:border-zinc-800">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm theo role code / tên / tenant..."
                className="w-full rounded-lg border-0 bg-zinc-50 py-2 pl-10 pr-4 text-sm text-zinc-900 ring-1 ring-inset ring-zinc-200 focus:ring-2 focus:ring-green-500 dark:bg-zinc-900/50 dark:text-white dark:ring-zinc-800"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center gap-2 py-12">
              <Loader2 className="h-6 w-6 animate-spin text-green-500" />
              <span className="text-sm text-zinc-500">Đang tải…</span>
            </div>
          ) : error ? (
            <div className="p-6 text-sm text-red-600 dark:text-red-400">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="border-b border-zinc-200 bg-zinc-50/50 text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/50">
                  <tr>
                    <th className="px-6 py-4 font-medium">Role</th>
                    <th className="px-6 py-4 font-medium">Code</th>
                    <th className="px-6 py-4 font-medium">Scope</th>
                    <th className="px-6 py-4 font-medium text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-sm text-zinc-500">
                        Không có role nào.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((role) => (
                      <tr key={role.id} className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                        <td className="px-6 py-4">
                          <p className="font-medium text-zinc-900 dark:text-white">{role.name ?? "—"}</p>
                          <p className="text-xs text-zinc-500">{role.description ?? "Không có mô tả"}</p>
                        </td>
                        <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">{role.code ?? "—"}</td>
                        <td className="px-6 py-4">
                          {role.isSystemRole ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs text-blue-700 ring-1 ring-blue-600/20 dark:bg-blue-500/10 dark:text-blue-300">
                              <Shield className="h-3 w-3" /> System
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-zinc-100 px-2 py-1 text-xs text-zinc-700 ring-1 ring-zinc-500/20 dark:bg-zinc-800 dark:text-zinc-300">
                              {role.tenantName ?? "Tenant role"}
                            </span>
                          )}
                        </td>
                        <td className="relative px-6 py-4 text-right">
                          <button
                            type="button"
                            onClick={(e) => toggleMenu(role.id, e.currentTarget)}
                            className="rounded-full p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                          >
                            <MoreVertical className="h-5 w-5" />
                          </button>
                          {actionLoadingId === role.id ? (
                            <span className="absolute right-10 top-1/2 -translate-y-1/2">
                              <Loader2 className="h-4 w-4 animate-spin text-green-500" />
                            </span>
                          ) : null}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {createOpen ? (
        <CreateRoleModal
          onClose={() => setCreateOpen(false)}
          onSuccess={() => {
            setCreateOpen(false);
            load();
          }}
        />
      ) : null}

      {editRole ? (
        <EditRoleModal
          role={editRole}
          onClose={() => setEditRole(null)}
          onSuccess={() => {
            setEditRole(null);
            load();
          }}
        />
      ) : null}

      {detail ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-zinc-900/60" onClick={() => setDetail(null)} />
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl dark:bg-zinc-950">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Chi tiết Role</h3>
            <dl className="mt-4 space-y-2 text-sm">
              <div><dt className="text-zinc-500">Name</dt><dd className="font-medium text-zinc-900 dark:text-white">{detail.name ?? "—"}</dd></div>
              <div><dt className="text-zinc-500">Code</dt><dd className="font-medium text-zinc-900 dark:text-white">{detail.code ?? "—"}</dd></div>
              <div><dt className="text-zinc-500">Description</dt><dd className="font-medium text-zinc-900 dark:text-white">{detail.description ?? "—"}</dd></div>
              <div><dt className="text-zinc-500">Scope</dt><dd className="font-medium text-zinc-900 dark:text-white">{detail.isSystemRole ? "System role" : detail.tenantName ?? "Tenant role"}</dd></div>
            </dl>
            <button type="button" onClick={() => setDetail(null)} className="mt-6 rounded-xl bg-zinc-200 px-4 py-2 text-sm font-medium text-zinc-800 dark:bg-zinc-700 dark:text-zinc-200">Đóng</button>
          </div>
        </div>
      ) : null}

      {openMenuId && menuPos ? (
        <>
          <div className="fixed inset-0 z-40" onClick={() => { setOpenMenuId(null); setMenuPos(null); }} />
          <div className="fixed z-50 w-52 rounded-xl border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-900" style={{ top: menuPos.top, left: menuPos.left }}>
            <button
              type="button"
              onClick={() => onView(openMenuId)}
              className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <Eye className="h-4 w-4" /> Xem chi tiết
            </button>
            <button
              type="button"
              onClick={() => {
                const role = list.find((r) => r.id === openMenuId) ?? null;
                setOpenMenuId(null);
                setMenuPos(null);
                setEditRole(role);
              }}
              className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <Pencil className="h-4 w-4" /> Cập nhật role
            </button>
            <button
              type="button"
              onClick={() => {
                const role = list.find((r) => r.id === openMenuId);
                if (role) void onDelete(role);
              }}
              className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
            >
              <Trash2 className="h-4 w-4" /> Xóa role
            </button>
          </div>
        </>
      ) : null}
    </SuperAdminLayout>
  );
}

function CreateRoleModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [form, setForm] = useState<CreateAdminRoleRequest>({ code: "", name: "", description: "", tenantId: null });
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code?.trim() || !form.name?.trim()) {
      alert("Code và Name là bắt buộc.");
      return;
    }
    setLoading(true);
    try {
      await createAdminRole({
        code: form.code.trim().toUpperCase(),
        name: form.name.trim(),
        description: form.description?.trim() || undefined,
        tenantId: form.tenantId?.trim() || null,
      });
      onSuccess();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Tạo role thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-zinc-900/60" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-xl dark:bg-zinc-950">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Tạo role mới</h3>
        <form onSubmit={submit} className="mt-4 space-y-3">
          <div>
            <label className="block text-xs font-medium text-zinc-500">Code *</label>
            <input value={form.code} onChange={(e) => setForm((p) => ({ ...p, code: e.target.value }))} className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm uppercase dark:border-zinc-700 dark:bg-zinc-900 dark:text-white" placeholder="TEAM_LEADER" />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500">Name *</label>
            <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-white" placeholder="Team Leader" />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500">Description</label>
            <textarea value={form.description ?? ""} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} className="mt-1 h-20 w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-white" />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500">Tenant ID (optional)</label>
            <input value={form.tenantId ?? ""} onChange={(e) => setForm((p) => ({ ...p, tenantId: e.target.value }))} className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-white" placeholder="Để trống nếu là system role" />
          </div>
          <div className="mt-6 flex gap-2">
            <button type="submit" disabled={loading} className="rounded-xl bg-green-500 px-4 py-2 text-sm font-semibold text-white hover:bg-green-600 disabled:opacity-50">
              {loading ? "Đang tạo..." : "Tạo role"}
            </button>
            <button type="button" onClick={onClose} className="rounded-xl border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 dark:border-zinc-700 dark:text-zinc-300">Hủy</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function EditRoleModal({
  role,
  onClose,
  onSuccess,
}: {
  role: AdminRoleResponse;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [name, setName] = useState(role.name ?? "");
  const [description, setDescription] = useState(role.description ?? "");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateAdminRole(role.id, { name: name.trim(), description: description.trim() || undefined });
      onSuccess();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Cập nhật role thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-zinc-900/60" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-xl dark:bg-zinc-950">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Cập nhật role</h3>
        <p className="mt-1 text-xs text-zinc-500">Code: {role.code ?? "—"} (không thể thay đổi)</p>
        <form onSubmit={submit} className="mt-4 space-y-3">
          <div>
            <label className="block text-xs font-medium text-zinc-500">Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-white" />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 h-20 w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-white" />
          </div>
          <div className="mt-6 flex gap-2">
            <button type="submit" disabled={loading} className="rounded-xl bg-green-500 px-4 py-2 text-sm font-semibold text-white hover:bg-green-600 disabled:opacity-50">
              {loading ? "Đang lưu..." : "Lưu"}
            </button>
            <button type="button" onClick={onClose} className="rounded-xl border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 dark:border-zinc-700 dark:text-zinc-300">Hủy</button>
          </div>
        </form>
      </div>
    </div>
  );
}
