"use client";

import { useState, useEffect } from "react";
import {
  getSubscriptionPlans,
  getActiveSubscriptionPlans,
  deleteSubscriptionPlan,
  createSubscriptionPlan,
  updateSubscriptionPlan,
  type SubscriptionPlanResponse,
} from "@/lib/api/admin";
import { Plus, MoreVertical, Pencil, Trash2, Loader2, Eye } from "lucide-react";

type Filter = "all" | "active";

export function SubscriptionPlansTable() {
  const [plans, setPlans] = useState<SubscriptionPlanResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [detailPlan, setDetailPlan] = useState<SubscriptionPlanResponse | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editPlan, setEditPlan] = useState<SubscriptionPlanResponse | null>(null);

  const load = () => {
    setLoading(true);
    setError(null);
    (filter === "active" ? getActiveSubscriptionPlans() : getSubscriptionPlans())
      .then(setPlans)
      .catch((e) => setError(e instanceof Error ? e.message : "Lỗi tải plans"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [filter]);

  const handleDelete = (id: string) => {
    if (!confirm("Bạn có chắc muốn deactivate plan này?")) return;
    setOpenMenuId(null);
    setActionLoading(id);
    deleteSubscriptionPlan(id)
      .then(load)
      .catch((e) => alert(e instanceof Error ? e.message : "Lỗi"))
      .finally(() => setActionLoading(null));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Subscription Plans (API 04)</h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`rounded-xl px-3 py-1.5 text-sm font-medium ${filter === "all" ? "bg-green-500 text-white" : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"}`}
          >
            Tất cả
          </button>
          <button
            type="button"
            onClick={() => setFilter("active")}
            className={`rounded-xl px-3 py-1.5 text-sm font-medium ${filter === "active" ? "bg-green-500 text-white" : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"}`}
          >
            Đang active
          </button>
          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600"
          >
            <Plus className="h-4 w-4" />
            Tạo plan
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 rounded-2xl bg-white py-12 dark:bg-zinc-950">
          <Loader2 className="h-6 w-6 animate-spin text-green-500" />
          <span className="text-sm text-zinc-500">Đang tải…</span>
        </div>
      ) : error ? (
        <div className="rounded-2xl bg-white p-6 text-sm text-red-600 dark:bg-zinc-950 dark:text-red-400">{error}</div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
                <tr>
                  <th className="px-6 py-3 font-semibold text-zinc-700 dark:text-zinc-300">Code / Tên</th>
                  <th className="px-6 py-3 font-semibold text-zinc-700 dark:text-zinc-300">Giá (tháng)</th>
                  <th className="px-6 py-3 font-semibold text-zinc-700 dark:text-zinc-300">Giới hạn</th>
                  <th className="px-6 py-3 font-semibold text-zinc-700 dark:text-zinc-300">Trạng thái</th>
                  <th className="px-6 py-3 text-right font-semibold text-zinc-700 dark:text-zinc-300">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {plans.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-zinc-500">Chưa có plan.</td>
                  </tr>
                ) : (
                  plans.map((p) => (
                    <tr key={p.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-zinc-900 dark:text-white">{p.code ?? p.id}</p>
                          <p className="text-xs text-zinc-500">{p.name ?? "—"}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {p.monthlyPrice != null ? `${Number(p.monthlyPrice).toLocaleString("vi-VN")} ${p.currency ?? "VND"}` : "—"}
                      </td>
                      <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">
                        Users: {p.maxUsers ?? "—"} · Docs: {p.maxDocuments ?? "—"}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${p.isActive ? "bg-green-500/10 text-green-600 dark:text-green-400" : "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400"}`}>
                          {p.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="relative px-6 py-4 text-right">
                        <button type="button" onClick={() => setOpenMenuId(openMenuId === p.id ? null : p.id)} className="rounded-full p-1.5 text-zinc-400 hover:text-zinc-600">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                        {openMenuId === p.id && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} />
                            <div className="absolute right-0 top-full z-20 mt-1 w-40 rounded-xl border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
                              <button type="button" onClick={() => { setDetailPlan(p); setOpenMenuId(null); }} className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800">
                                <Eye className="h-4 w-4" /> Xem chi tiết
                              </button>
                              <button type="button" onClick={() => { setEditPlan(p); setOpenMenuId(null); }} className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800">
                                <Pencil className="h-4 w-4" /> Cập nhật
                              </button>
                              <button type="button" onClick={() => handleDelete(p.id)} disabled={!!actionLoading} className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30">
                                <Trash2 className="h-4 w-4" /> Xóa (deactivate)
                              </button>
                            </div>
                          </>
                        )}
                        {actionLoading === p.id && <Loader2 className="inline h-4 w-4 animate-spin text-green-500 ml-1" />}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {detailPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-zinc-900/60" onClick={() => setDetailPlan(null)} />
          <div className="relative max-h-[90vh] w-full max-w-lg overflow-auto rounded-3xl bg-white p-6 shadow-xl dark:bg-zinc-950">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Chi tiết plan: {detailPlan.code ?? detailPlan.name}</h3>
            <dl className="mt-4 space-y-2 text-sm">
              <div><dt className="text-zinc-500">Code</dt><dd className="font-medium text-zinc-900 dark:text-white">{detailPlan.code ?? "—"}</dd></div>
              <div><dt className="text-zinc-500">Tên</dt><dd className="font-medium text-zinc-900 dark:text-white">{detailPlan.name ?? "—"}</dd></div>
              <div><dt className="text-zinc-500">Mô tả</dt><dd className="font-medium text-zinc-900 dark:text-white">{detailPlan.description ?? "—"}</dd></div>
              <div><dt className="text-zinc-500">Giá tháng / quý / năm</dt><dd className="font-medium text-zinc-900 dark:text-white">{detailPlan.monthlyPrice != null ? `${Number(detailPlan.monthlyPrice).toLocaleString("vi-VN")} / ${Number(detailPlan.quarterlyPrice).toLocaleString("vi-VN")} / ${Number(detailPlan.yearlyPrice).toLocaleString("vi-VN")} ${detailPlan.currency ?? ""}` : "—"}</dd></div>
              <div><dt className="text-zinc-500">Max users / documents / storage (GB)</dt><dd className="font-medium text-zinc-900 dark:text-white">{detailPlan.maxUsers ?? "—"} / {detailPlan.maxDocuments ?? "—"} / {detailPlan.maxStorageGb ?? "—"}</dd></div>
              <div><dt className="text-zinc-500">Active</dt><dd className="font-medium text-zinc-900 dark:text-white">{detailPlan.isActive ? "Có" : "Không"}</dd></div>
            </dl>
            <button type="button" onClick={() => setDetailPlan(null)} className="mt-6 rounded-xl bg-zinc-200 px-4 py-2 text-sm font-medium dark:bg-zinc-700 dark:text-zinc-200">Đóng</button>
          </div>
        </div>
      )}

      {createOpen && <CreatePlanModal onClose={() => setCreateOpen(false)} onSuccess={() => { setCreateOpen(false); load(); }} />}
      {editPlan && <EditPlanModal plan={editPlan} onClose={() => setEditPlan(null)} onSuccess={() => { setEditPlan(null); load(); }} />}
    </div>
  );
}

function CreatePlanModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [monthlyPrice, setMonthlyPrice] = useState("0");
  const [quarterlyPrice, setQuarterlyPrice] = useState("0");
  const [yearlyPrice, setYearlyPrice] = useState("0");
  const [maxUsers, setMaxUsers] = useState("10");
  const [maxDocuments, setMaxDocuments] = useState("100");
  const [maxStorageGb, setMaxStorageGb] = useState("5");
  const [displayOrder, setDisplayOrder] = useState("0");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createSubscriptionPlan({
        code: code.trim(),
        name: name.trim(),
        description: description.trim() || undefined,
        monthlyPrice: Number(monthlyPrice),
        quarterlyPrice: Number(quarterlyPrice),
        yearlyPrice: Number(yearlyPrice),
        maxUsers: Number(maxUsers),
        maxDocuments: Number(maxDocuments),
        maxStorageGb: Number(maxStorageGb),
        maxApiCalls: 10000,
        maxChatbotRequests: 1000,
        maxRagDocuments: 500,
        maxAiTokens: 100000,
        contextWindowTokens: 4096,
        ragChunkSize: 512,
        enableRag: true,
        isTrial: false,
        displayOrder: Number(displayOrder),
      });
      onSuccess();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Tạo plan thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-zinc-900/60" onClick={onClose} />
      <div className="relative max-h-[90vh] w-full max-w-md overflow-auto rounded-3xl bg-white p-6 shadow-xl dark:bg-zinc-950">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Tạo plan mới</h3>
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div><label className="block text-xs text-zinc-500">Code *</label><input type="text" value={code} onChange={(e) => setCode(e.target.value)} required className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-white" /></div>
          <div><label className="block text-xs text-zinc-500">Tên *</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-white" /></div>
          <div><label className="block text-xs text-zinc-500">Mô tả</label><input type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-white" /></div>
          <div className="grid grid-cols-3 gap-2">
            <div><label className="block text-xs text-zinc-500">Giá tháng</label><input type="number" min="0" value={monthlyPrice} onChange={(e) => setMonthlyPrice(e.target.value)} className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-white" /></div>
            <div><label className="block text-xs text-zinc-500">Giá quý</label><input type="number" min="0" value={quarterlyPrice} onChange={(e) => setQuarterlyPrice(e.target.value)} className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-white" /></div>
            <div><label className="block text-xs text-zinc-500">Giá năm</label><input type="number" min="0" value={yearlyPrice} onChange={(e) => setYearlyPrice(e.target.value)} className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-white" /></div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div><label className="block text-xs text-zinc-500">Max users</label><input type="number" min="1" value={maxUsers} onChange={(e) => setMaxUsers(e.target.value)} className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-white" /></div>
            <div><label className="block text-xs text-zinc-500">Max documents</label><input type="number" min="0" value={maxDocuments} onChange={(e) => setMaxDocuments(e.target.value)} className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-white" /></div>
            <div><label className="block text-xs text-zinc-500">Max storage (GB)</label><input type="number" min="1" value={maxStorageGb} onChange={(e) => setMaxStorageGb(e.target.value)} className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-white" /></div>
            <div><label className="block text-xs text-zinc-500">Display order</label><input type="number" min="0" value={displayOrder} onChange={(e) => setDisplayOrder(e.target.value)} className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-white" /></div>
          </div>
          <div className="mt-6 flex gap-2">
            <button type="submit" disabled={loading} className="rounded-xl bg-green-500 px-4 py-2 text-sm font-semibold text-white hover:bg-green-600 disabled:opacity-50">{loading ? <Loader2 className="h-4 w-4 animate-spin inline" /> : "Tạo"}</button>
            <button type="button" onClick={onClose} className="rounded-xl border border-zinc-300 px-4 py-2 text-sm font-medium dark:border-zinc-700 dark:text-zinc-300">Hủy</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function EditPlanModal({ plan, onClose, onSuccess }: { plan: SubscriptionPlanResponse; onClose: () => void; onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(plan.name ?? "");
  const [description, setDescription] = useState(plan.description ?? "");
  const [monthlyPrice, setMonthlyPrice] = useState(String(plan.monthlyPrice ?? 0));
  const [quarterlyPrice, setQuarterlyPrice] = useState(String(plan.quarterlyPrice ?? 0));
  const [yearlyPrice, setYearlyPrice] = useState(String(plan.yearlyPrice ?? 0));
  const [maxUsers, setMaxUsers] = useState(String(plan.maxUsers ?? 10));
  const [maxDocuments, setMaxDocuments] = useState(String(plan.maxDocuments ?? 100));
  const [maxStorageGb, setMaxStorageGb] = useState(String(plan.maxStorageGb ?? 5));
  const [isActive, setIsActive] = useState(plan.isActive ?? true);
  const [displayOrder, setDisplayOrder] = useState(String(plan.displayOrder ?? 0));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateSubscriptionPlan(plan.id, {
        name: name.trim(),
        description: description.trim() || undefined,
        monthlyPrice: Number(monthlyPrice),
        quarterlyPrice: Number(quarterlyPrice),
        yearlyPrice: Number(yearlyPrice),
        maxUsers: Number(maxUsers),
        maxDocuments: Number(maxDocuments),
        maxStorageGb: Number(maxStorageGb),
        maxApiCalls: plan.maxApiCalls ?? 10000,
        maxChatbotRequests: plan.maxChatbotRequests ?? 1000,
        maxRagDocuments: plan.maxRagDocuments ?? 500,
        maxAiTokens: plan.maxAiTokens ?? 100000,
        contextWindowTokens: plan.contextWindowTokens ?? 4096,
        ragChunkSize: plan.ragChunkSize ?? 512,
        enableRag: plan.enableRag ?? true,
        isActive,
        displayOrder: Number(displayOrder),
      });
      onSuccess();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Cập nhật thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-zinc-900/60" onClick={onClose} />
      <div className="relative max-h-[90vh] w-full max-w-md overflow-auto rounded-3xl bg-white p-6 shadow-xl dark:bg-zinc-950">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Cập nhật plan: {plan.code}</h3>
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div><label className="block text-xs text-zinc-500">Tên *</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-white" /></div>
          <div><label className="block text-xs text-zinc-500">Mô tả</label><input type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-white" /></div>
          <div className="grid grid-cols-3 gap-2">
            <div><label className="block text-xs text-zinc-500">Giá tháng</label><input type="number" min="0" value={monthlyPrice} onChange={(e) => setMonthlyPrice(e.target.value)} className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-white" /></div>
            <div><label className="block text-xs text-zinc-500">Giá quý</label><input type="number" min="0" value={quarterlyPrice} onChange={(e) => setQuarterlyPrice(e.target.value)} className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-white" /></div>
            <div><label className="block text-xs text-zinc-500">Giá năm</label><input type="number" min="0" value={yearlyPrice} onChange={(e) => setYearlyPrice(e.target.value)} className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-white" /></div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div><label className="block text-xs text-zinc-500">Max users</label><input type="number" min="1" value={maxUsers} onChange={(e) => setMaxUsers(e.target.value)} className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-white" /></div>
            <div><label className="block text-xs text-zinc-500">Max documents</label><input type="number" min="0" value={maxDocuments} onChange={(e) => setMaxDocuments(e.target.value)} className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-white" /></div>
            <div><label className="block text-xs text-zinc-500">Max storage (GB)</label><input type="number" min="1" value={maxStorageGb} onChange={(e) => setMaxStorageGb(e.target.value)} className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-white" /></div>
            <div><label className="block text-xs text-zinc-500">Display order</label><input type="number" min="0" value={displayOrder} onChange={(e) => setDisplayOrder(e.target.value)} className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-white" /></div>
          </div>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="rounded text-green-500" />
            <span className="text-sm text-zinc-700 dark:text-zinc-300">Đang active</span>
          </label>
          <div className="mt-6 flex gap-2">
            <button type="submit" disabled={loading} className="rounded-xl bg-green-500 px-4 py-2 text-sm font-semibold text-white hover:bg-green-600 disabled:opacity-50">{loading ? <Loader2 className="h-4 w-4 animate-spin inline" /> : "Lưu"}</button>
            <button type="button" onClick={onClose} className="rounded-xl border border-zinc-300 px-4 py-2 text-sm font-medium dark:border-zinc-700 dark:text-zinc-300">Hủy</button>
          </div>
        </form>
      </div>
    </div>
  );
}
