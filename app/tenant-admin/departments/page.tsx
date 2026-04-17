 "use client";

import { useState } from "react";
import { TenantAdminLayout } from "@/components/tenant-admin/TenantAdminLayout";
import { DepartmentsTable } from "@/components/tenant-admin/DepartmentsTable";
import { Filter, Plus } from "lucide-react";
import { createTenantDepartment } from "@/lib/api/tenant-admin";
import { useLanguageStore } from "@/lib/language-store";
import { translations } from "@/lib/translations";
import { AnimatedSegmentedControl } from "@/components/ui";

export default function DepartmentsPage() {
  const { language } = useLanguageStore();
  const t = translations[language];
  const [createOpen, setCreateOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");

  return (
    <TenantAdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
            {t.manageDepartments}
          </h1>
          <p className="mt-1.5 text-sm text-zinc-600 dark:text-zinc-400">
            {t.organizationStructure}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
            <Filter className="h-4 w-4" />
            {language === "en" ? "Filters" : "Bộ lọc"}
          </div>

          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all hover:bg-emerald-600 hover:shadow-xl hover:shadow-emerald-500/40"
          >
            <Plus className="h-4 w-4" />
            {t.addDepartment}
          </button>
        </div>

        <AnimatedSegmentedControl
          value={filter}
          onChange={setFilter}
          layoutId="departments-filter-pill"
          options={[
            { value: "all", label: t.allDepartments },
            { value: "active", label: t.activeDepartments },
            { value: "inactive", label: language === "en" ? "Inactive" : "Không hoạt động" },
          ]}
        />

        <div className="min-w-0">
          <DepartmentsTable refreshKey={refreshKey} filter={filter} />
        </div>
      </div>

      {createOpen && (
        <CreateDepartmentModal
          onClose={() => setCreateOpen(false)}
          onSuccess={() => {
            setCreateOpen(false);
            setRefreshKey((k) => k + 1);
          }}
        />
      )}
    </TenantAdminLayout>
  );
}

function CreateDepartmentModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!code.trim() || !name.trim()) {
      setError("Vui lòng nhập Code và Tên phòng ban.");
      return;
    }
    setLoading(true);
    try {
      await createTenantDepartment({
        code: code.trim(),
        name: name.trim(),
        description: description.trim() || undefined,
      });
      onSuccess();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Tạo phòng ban thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-zinc-900/60" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-xl dark:bg-zinc-950">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Thêm phòng ban</h3>
        <p className="mt-1 text-xs text-zinc-500">Tạo mới phòng ban trong tổ chức.</p>

        {error && (
          <p className="mt-3 rounded-xl bg-rose-50 p-2.5 text-sm text-rose-800 dark:bg-rose-950/40 dark:text-rose-200">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div>
            <label className="block text-xs font-medium text-zinc-500">Code *</label>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
              placeholder="HR"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500">Tên *</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
              placeholder="Phòng Nhân Sự"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500">Mô tả</label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
              placeholder="(tuỳ chọn)"
            />
          </div>

          <div className="mt-6 flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-green-500 px-4 py-2 text-sm font-semibold text-white hover:bg-green-600 disabled:opacity-50"
            >
              {loading ? "Đang tạo…" : "Tạo"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 dark:border-zinc-700 dark:text-zinc-300"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
