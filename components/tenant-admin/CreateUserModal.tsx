"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { getTenantRoles, getTenantDepartments, createTenantUser, type CreateUserRequest, type RoleResponse, type DepartmentResponse } from "@/lib/api/tenant-admin";

interface CreateUserModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const SYSTEM_ROLES_TO_EXCLUDE = ['TENANT_ADMIN', 'SUPER_ADMIN', 'STAFF'];

export function CreateUserModal({ open, onClose, onSuccess }: CreateUserModalProps) {
  const [fullName, setFullName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [roleId, setRoleId] = useState<number | "">("");
  const [departmentId, setDepartmentId] = useState<number | "">("");
  const [roles, setRoles] = useState<RoleResponse[]>([]);
  const [departments, setDepartments] = useState<DepartmentResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadOptions, setLoadOptions] = useState(true);

  useEffect(() => {
    if (!open) return;
    setFullName("");
    setContactEmail("");
    setPhoneNumber("");
    setRoleId("");
    setDepartmentId("");
    setLoadOptions(true);
  }, [open]);

  useEffect(() => {
    if (!open || !loadOptions) return;
    Promise.all([getTenantRoles(), getTenantDepartments()])
      .then(([r, d]) => {
        setRoles(r);
        setDepartments(d);
      })
      .catch(() => {})
      .finally(() => setLoadOptions(false));
  }, [open, loadOptions]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !contactEmail.trim()) {
      alert("Họ tên và email không được để trống.");
      return;
    }
    if (roleId === "" || roleId === undefined) {
      alert("Vui lòng chọn vai trò.");
      return;
    }
    setLoading(true);
    try {
      const cleanPhone = phoneNumber.replace(/-/g, '');
      const body: CreateUserRequest = {
        fullName: fullName.trim(),
        contactEmail: contactEmail.trim(),
        roleId: Number(roleId),
      };
      if (cleanPhone.trim()) body.phoneNumber = cleanPhone.trim();
      if (departmentId !== "") body.departmentId = Number(departmentId);
      await createTenantUser(body);
      onSuccess();
      onClose();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Tạo user thất bại");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-zinc-900/60" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-xl dark:bg-zinc-950">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Tạo user mới</h3>
        <p className="mt-1 text-xs text-zinc-500">Thêm nhân viên mới vào tổ chức và gán phòng ban/vai trò.</p>
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div>
            <label className="block text-xs font-medium text-zinc-500">Họ tên *</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500">Email (contact) *</label>
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              required
              className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500">Số điện thoại</label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
            />
            <p className="mt-1 text-xs text-zinc-500">
              Định dạng: 0xxxxxxxxx hoặc +84xxxxxxxxx (không dùng dấu gạch ngang)
            </p>
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500">Vai trò *</label>
            <select
              value={roleId}
              onChange={(e) => setRoleId(e.target.value === "" ? "" : Number(e.target.value))}
              required
              className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
            >
              <option value="">-- Chọn --</option>
              {roles.filter((r) => !SYSTEM_ROLES_TO_EXCLUDE.some((s) => r.code?.includes(s))).map((r) => (
                <option key={r.id} value={r.id}>{r.name ?? r.code ?? r.id}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500">Phòng ban</label>
            <select
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value === "" ? "" : Number(e.target.value))}
              className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
            >
              <option value="">-- Không chọn --</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>{d.name ?? d.code ?? d.id}</option>
              ))}
            </select>
          </div>
          <div className="mt-6 flex gap-2">
            <button type="submit" disabled={loading} className="rounded-xl bg-green-500 px-4 py-2 text-sm font-semibold text-white hover:bg-green-600 disabled:opacity-50">
              {loading ? <Loader2 className="h-4 w-4 animate-spin inline" /> : "Tạo user"}
            </button>
            <button type="button" onClick={onClose} className="rounded-xl border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 dark:border-zinc-700 dark:text-zinc-300">
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
