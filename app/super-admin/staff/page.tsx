"use client";

import { useState, useEffect } from "react";
import { SuperAdminLayout } from "@/components/super-admin/SuperAdminLayout";
import {
  getStaffList,
  getStaffById,
  createStaff,
  activateStaff,
  deactivateStaff,
  deleteStaff,
  type StaffUser,
  type CreateStaffRequest,
} from "@/lib/api/admin";
import { UserPlus, MoreVertical, Eye, UserCheck, UserX, Trash2, Loader2, Search } from "lucide-react";

export default function StaffManagementPage() {
  const [list, setList] = useState<StaffUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [detailUser, setDetailUser] = useState<StaffUser | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const load = () => {
    setLoading(true);
    setError(null);
    getStaffList()
      .then(setList)
      .catch((e) => setError(e instanceof Error ? e.message : "Lỗi tải danh sách"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleActivate = (userId: string) => {
    setOpenMenuId(null);
    setActionLoading(userId);
    activateStaff(userId)
      .then(load)
      .catch((e) => alert(e instanceof Error ? e.message : "Lỗi"))
      .finally(() => setActionLoading(null));
  };

  const handleDeactivate = (userId: string) => {
    setOpenMenuId(null);
    setActionLoading(userId);
    deactivateStaff(userId)
      .then(load)
      .catch((e) => alert(e instanceof Error ? e.message : "Lỗi"))
      .finally(() => setActionLoading(null));
  };

  const handleDelete = (userId: string) => {
    if (!confirm("Bạn có chắc muốn xóa tài khoản STAFF này?")) return;
    setOpenMenuId(null);
    setActionLoading(userId);
    deleteStaff(userId)
      .then(load)
      .catch((e) => alert(e instanceof Error ? e.message : "Lỗi"))
      .finally(() => setActionLoading(null));
  };

  const handleViewDetail = (userId: string) => {
    setOpenMenuId(null);
    getStaffById(userId)
      .then(setDetailUser)
      .catch((e) => alert(e instanceof Error ? e.message : "Lỗi"));
  };

  const filtered = search.trim()
    ? list.filter(
        (s) =>
          (s.fullName ?? "").toLowerCase().includes(search.toLowerCase()) ||
          (s.email ?? "").toLowerCase().includes(search.toLowerCase())
      )
    : list;

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
              Quản lý Staff (API 03)
            </h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Tạo, xem, kích hoạt / vô hiệu hóa, xóa tài khoản STAFF
            </p>
          </div>
          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-600"
          >
            <UserPlus className="h-4 w-4" />
            Thêm Staff
          </button>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="border-b border-zinc-200 p-4 dark:border-zinc-800">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Tìm theo tên hoặc email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
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
                    <th className="px-6 py-4 font-medium">Tên / Email</th>
                    <th className="px-6 py-4 font-medium">SĐT</th>
                    <th className="px-6 py-4 font-medium">Trạng thái</th>
                    <th className="px-6 py-4 font-medium text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-sm text-zinc-500">
                        Chưa có staff. Bấm &quot;Thêm Staff&quot; để tạo.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((staff) => (
                      <tr key={staff.id} className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-zinc-900 dark:text-white">{staff.fullName ?? "—"}</p>
                            <p className="text-xs text-zinc-500">{staff.email ?? "—"}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">{staff.phoneNumber ?? "—"}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium ${
                              staff.isActive
                                ? "bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20 dark:bg-green-500/10 dark:text-green-400"
                                : "bg-zinc-50 text-zinc-600 ring-1 ring-inset ring-zinc-500/20 dark:bg-zinc-500/10 dark:text-zinc-400"
                            }`}
                          >
                            <span className={`h-1.5 w-1.5 rounded-full ${staff.isActive ? "bg-green-500" : "bg-zinc-400"}`} />
                            {staff.isActive ? "Active" : "Vô hiệu hóa"}
                          </span>
                        </td>
                        <td className="relative px-6 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => setOpenMenuId(openMenuId === staff.id ? null : staff.id)}
                            className="rounded-full p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                          >
                            <MoreVertical className="h-5 w-5" />
                          </button>
                          {openMenuId === staff.id && (
                            <>
                              <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} />
                              <div className="absolute right-0 top-full z-20 mt-1 w-48 rounded-xl border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
                                <button type="button" onClick={() => handleViewDetail(staff.id)} className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800">
                                  <Eye className="h-4 w-4" /> Xem chi tiết
                                </button>
                                {staff.isActive ? (
                                  <button type="button" onClick={() => handleDeactivate(staff.id)} disabled={!!actionLoading} className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-amber-700 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-950/30">
                                    <UserX className="h-4 w-4" /> Vô hiệu hóa
                                  </button>
                                ) : (
                                  <button type="button" onClick={() => handleActivate(staff.id)} disabled={!!actionLoading} className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-950/30">
                                    <UserCheck className="h-4 w-4" /> Kích hoạt
                                  </button>
                                )}
                                <button type="button" onClick={() => handleDelete(staff.id)} disabled={!!actionLoading} className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30">
                                  <Trash2 className="h-4 w-4" /> Xóa
                                </button>
                              </div>
                            </>
                          )}
                          {actionLoading === staff.id && (
                            <span className="absolute right-10 top-1/2 -translate-y-1/2">
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
          )}
        </div>
      </div>

      {createOpen && (
        <CreateStaffModal
          onClose={() => setCreateOpen(false)}
          onSuccess={() => {
            setCreateOpen(false);
            load();
          }}
        />
      )}

      {detailUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-zinc-900/60" onClick={() => setDetailUser(null)} />
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-xl dark:bg-zinc-950">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Chi tiết Staff</h3>
            <dl className="mt-4 space-y-2 text-sm">
              <div><dt className="text-zinc-500">Họ tên</dt><dd className="font-medium text-zinc-900 dark:text-white">{detailUser.fullName ?? "—"}</dd></div>
              <div><dt className="text-zinc-500">Email</dt><dd className="font-medium text-zinc-900 dark:text-white">{detailUser.email ?? "—"}</dd></div>
              <div><dt className="text-zinc-500">SĐT</dt><dd className="font-medium text-zinc-900 dark:text-white">{detailUser.phoneNumber ?? "—"}</dd></div>
              <div><dt className="text-zinc-500">Trạng thái</dt><dd className="font-medium text-zinc-900 dark:text-white">{detailUser.isActive ? "Active" : "Vô hiệu hóa"}</dd></div>
              <div><dt className="text-zinc-500">Ngày tạo</dt><dd className="font-medium text-zinc-900 dark:text-white">{detailUser.createdAt ? new Date(detailUser.createdAt).toLocaleDateString("vi-VN") : "—"}</dd></div>
            </dl>
            <button type="button" onClick={() => setDetailUser(null)} className="mt-6 rounded-xl bg-zinc-200 px-4 py-2 text-sm font-medium text-zinc-800 dark:bg-zinc-700 dark:text-zinc-200">Đóng</button>
          </div>
        </div>
      )}
    </SuperAdminLayout>
  );
}

function CreateStaffModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !fullName.trim()) {
      alert("Email và họ tên không được để trống.");
      return;
    }
    setLoading(true);
    try {
      const body: CreateStaffRequest = { email: email.trim(), fullName: fullName.trim() };
      if (phone.trim()) body.phone = phone.trim();
      await createStaff(body);
      alert("Tài khoản STAFF đã được tạo. Email thông tin đăng nhập đã được gửi.");
      onSuccess();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Tạo staff thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-zinc-900/60" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-xl dark:bg-zinc-950">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Tạo tài khoản STAFF</h3>
        <p className="mt-1 text-xs text-zinc-500">POST /api/v1/admin/staff</p>
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div>
            <label className="block text-xs font-medium text-zinc-500">Email *</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-white" />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500">Họ tên *</label>
            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-white" />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500">Số điện thoại</label>
            <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-white" />
          </div>
          <div className="mt-6 flex gap-2">
            <button type="submit" disabled={loading} className="rounded-xl bg-green-500 px-4 py-2 text-sm font-semibold text-white hover:bg-green-600 disabled:opacity-50">
              {loading ? <Loader2 className="h-4 w-4 animate-spin inline" /> : "Tạo"}
            </button>
            <button type="button" onClick={onClose} className="rounded-xl border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 dark:border-zinc-700 dark:text-zinc-300">Hủy</button>
          </div>
        </form>
      </div>
    </div>
  );
}
