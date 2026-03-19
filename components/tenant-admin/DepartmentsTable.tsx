"use client";

import { useState, useEffect } from "react";
import { Pencil, Trash2, MoreVertical } from "lucide-react";
import {
  getTenantDepartments,
  getTenantActiveDepartments,
  updateTenantDepartment,
  deleteTenantDepartment,
  type DepartmentResponse,
  type UpdateDepartmentRequest,
} from "@/lib/api/tenant-admin";

export function DepartmentsTable({
  refreshKey = 0,
  filter,
}: {
  refreshKey?: number;
  filter: "all" | "active";
}) {
  const [departments, setDepartments] = useState<DepartmentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editDept, setEditDept] = useState<DepartmentResponse | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const load = async () => {
      try {
        const data =
          filter === "active" ? await getTenantActiveDepartments() : await getTenantDepartments();
        setDepartments(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Lỗi tải danh sách");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [refreshKey, filter]);

  useEffect(() => {
    if (openMenuId == null) return;
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

  const toggleMenu = (deptId: number, anchor: HTMLElement) => {
    if (openMenuId === deptId) {
      setOpenMenuId(null);
      setMenuPos(null);
      return;
    }
    const rect = anchor.getBoundingClientRect();
    const menuWidth = 200; // keep >= menu content
    const margin = 12;
    const left = Math.min(
      Math.max(rect.right - menuWidth, margin),
      window.innerWidth - margin - menuWidth
    );
    setMenuPos({ top: rect.bottom + 6, left });
    setOpenMenuId(deptId);
  };

  if (loading) {
    return (
      <div className="overflow-hidden rounded-3xl bg-white p-8 shadow-lg dark:bg-zinc-950">
        <p className="text-sm text-zinc-500">Đang tải danh sách phòng ban…</p>
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
    <div className="overflow-hidden rounded-3xl bg-white shadow-lg shadow-green-100/60 dark:bg-zinc-950 dark:shadow-black/40">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-zinc-100 dark:divide-zinc-900">
          <thead className="bg-zinc-50 dark:bg-zinc-900">
            <tr>
              <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400">Department</th>
              <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400">Code</th>
              <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400">Employees</th>
              <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400">Status</th>
              <th className="relative px-6 py-4"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 bg-white dark:divide-zinc-900 dark:bg-zinc-950">
            {departments.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-sm text-zinc-500">
                  Chưa có phòng ban. Dữ liệu được tải từ server.
                </td>
              </tr>
            ) : (
              departments.map((dept) => (
                <tr key={dept.id} className="transition hover:bg-zinc-50 dark:hover:bg-zinc-900">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-zinc-900 dark:text-white">{dept.name ?? "—"}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">{dept.code ?? "—"}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-900 dark:text-white">{dept.employeeCount ?? "—"}</td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                        (dept.isActive ?? (filter === "active")) ? "bg-green-500/10 text-green-600 dark:text-green-400" : "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400"
                      }`}
                    >
                      {(dept.isActive ?? (filter === "active")) ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right">
                    <button
                      type="button"
                      aria-label="Thao tác"
                      onClick={(e) => toggleMenu(dept.id, e.currentTarget)}
                      className="rounded-full p-1.5 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-500 dark:hover:bg-zinc-900"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {openMenuId != null && menuPos != null && (
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
              onClick={() => {
                const selected = departments.find((d) => d.id === openMenuId);
                if (selected) setEditDept(selected);
                setOpenMenuId(null);
                setMenuPos(null);
              }}
              className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <Pencil className="h-4 w-4" /> Sửa
            </button>
            <button
              type="button"
              onClick={() => {
                if (!confirm("Bạn có chắc muốn xóa phòng ban này?")) return;
                setActionLoadingId(openMenuId);
                deleteTenantDepartment(openMenuId)
                  .then(async () => {
                    const data =
                      filter === "active" ? await getTenantActiveDepartments() : await getTenantDepartments();
                    setDepartments(data);
                    setOpenMenuId(null);
                    setMenuPos(null);
                  })
                  .catch((e) => alert(e instanceof Error ? e.message : "Xóa thất bại"))
                  .finally(() => setActionLoadingId(null));
              }}
              disabled={actionLoadingId === openMenuId}
              className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 disabled:opacity-60 dark:text-red-400 dark:hover:bg-red-950/30"
            >
              <Trash2 className="h-4 w-4" /> {actionLoadingId === openMenuId ? "Đang xóa…" : "Xóa"}
            </button>
          </div>
        </>
      )}

      {editDept && (
        <EditDepartmentModal
          dept={editDept}
          onClose={() => setEditDept(null)}
          onSave={async (body) => {
            setEditLoading(true);
            try {
              await updateTenantDepartment(editDept.id, body);
              const data =
                filter === "active" ? await getTenantActiveDepartments() : await getTenantDepartments();
              setDepartments(data);
              setEditDept(null);
            } finally {
              setEditLoading(false);
            }
          }}
          loading={editLoading}
        />
      )}
    </div>
  );
}

function EditDepartmentModal({
  dept,
  onClose,
  onSave,
  loading,
}: {
  dept: DepartmentResponse;
  onClose: () => void;
  onSave: (body: UpdateDepartmentRequest) => Promise<void>;
  loading: boolean;
}) {
  const [code, setCode] = useState(dept.code ?? "");
  const [name, setName] = useState(dept.name ?? "");
  const [description, setDescription] = useState(dept.description ?? "");
  const [isActive, setIsActive] = useState(dept.isActive ?? true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body: UpdateDepartmentRequest = {
      code: code.trim() || undefined,
      name: name.trim() || undefined,
      description: description.trim() || undefined,
      isActive,
    };
    await onSave(body);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-zinc-900/60" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-xl dark:bg-zinc-950">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Cập nhật phòng ban</h3>
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div>
            <label className="block text-xs font-medium text-zinc-500">Code</label>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500">Tên</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500">Mô tả</label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
            />
          </div>
          <label className="flex items-center gap-2 pt-1 text-sm text-zinc-700 dark:text-zinc-200">
            <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="rounded text-green-500" />
            Đang hoạt động
          </label>
          <div className="mt-6 flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-green-500 px-4 py-2 text-sm font-semibold text-white hover:bg-green-600 disabled:opacity-60"
            >
              {loading ? "Đang lưu…" : "Lưu"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 dark:border-zinc-700 dark:text-zinc-200"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
