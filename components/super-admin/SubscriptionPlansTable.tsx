"use client";

import { useState, useEffect } from "react";
import {
  getSubscriptionPlans,
  getActiveSubscriptionPlans,
  deleteSubscriptionPlan,
  updateSubscriptionPlan,
  type SubscriptionPlanResponse,
} from "@/lib/api/admin";
import { MoreVertical, Pencil, Trash2, Loader2, Eye } from "lucide-react";

type Filter = "all" | "active";

export function SubscriptionPlansTable() {
  const [plans, setPlans] = useState<SubscriptionPlanResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [detailPlan, setDetailPlan] = useState<SubscriptionPlanResponse | null>(null);
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

  const toggleMenu = (planId: string, anchor: HTMLElement) => {
    if (openMenuId === planId) {
      setOpenMenuId(null);
      setMenuPos(null);
      return;
    }
    const rect = anchor.getBoundingClientRect();
    const menuWidth = 160; // w-40
    const margin = 12;
    const left = Math.min(
      Math.max(rect.right - menuWidth, margin),
      window.innerWidth - margin - menuWidth
    );
    setMenuPos({ top: rect.bottom + 6, left });
    setOpenMenuId(planId);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Bạn có chắc muốn deactivate plan này?")) return;
    setOpenMenuId(null);
    setMenuPos(null);
    setActionLoading(id);
    deleteSubscriptionPlan(id)
      .then(load)
      .catch((e) => alert(e instanceof Error ? e.message : "Lỗi"))
      .finally(() => setActionLoading(null));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Subscription Plans</h2>
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
                        <button
                          type="button"
                          onClick={(e) => toggleMenu(p.id, e.currentTarget)}
                          className="rounded-full p-1.5 text-zinc-400 hover:text-zinc-600"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
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

      {editPlan && <EditPlanModal plan={editPlan} onClose={() => setEditPlan(null)} onSuccess={() => { setEditPlan(null); load(); }} />}

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
            className="fixed z-50 w-40 rounded-xl border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-900"
            style={{ top: menuPos.top, left: menuPos.left }}
          >
            <button
              type="button"
              onClick={() => {
                const selected = plans.find((x) => x.id === openMenuId) ?? null;
                if (selected) setDetailPlan(selected);
                setOpenMenuId(null);
                setMenuPos(null);
              }}
              className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <Eye className="h-4 w-4" /> Xem chi tiết
            </button>
            <button
              type="button"
              onClick={() => {
                const selected = plans.find((x) => x.id === openMenuId) ?? null;
                if (selected) setEditPlan(selected);
                setOpenMenuId(null);
                setMenuPos(null);
              }}
              className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <Pencil className="h-4 w-4" /> Cập nhật
            </button>
            <button
              type="button"
              onClick={() => handleDelete(openMenuId)}
              disabled={!!actionLoading}
              className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 disabled:opacity-60 dark:text-red-400 dark:hover:bg-red-950/30"
            >
              <Trash2 className="h-4 w-4" /> Xóa (deactivate)
            </button>
          </div>
        </>
      )}
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

  const toInt = (v: string, fallback: number) => {
    const n = Number(v);
    return Number.isFinite(n) ? Math.trunc(n) : fallback;
  };
  const toNum = (v: string, fallback: number) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateSubscriptionPlan(plan.id, {
        name: name.trim(),
        description: description.trim() || undefined,
        monthlyPrice: toNum(monthlyPrice, 0),
        quarterlyPrice: toNum(quarterlyPrice, 0),
        yearlyPrice: toNum(yearlyPrice, 0),
        maxUsers: Math.max(1, toInt(maxUsers, plan.maxUsers ?? 10)),
        maxDocuments: Math.max(0, toInt(maxDocuments, plan.maxDocuments ?? 100)),
        maxStorageGb: Math.max(1, toInt(maxStorageGb, plan.maxStorageGb ?? 5)),
        maxApiCalls: Math.max(0, Math.trunc(plan.maxApiCalls ?? 10000)),
        maxChatbotRequests: Math.max(0, Math.trunc(plan.maxChatbotRequests ?? 1000)),
        maxRagDocuments: Math.max(0, Math.trunc(plan.maxRagDocuments ?? 500)),
        maxAiTokens: Math.max(0, Math.trunc(plan.maxAiTokens ?? 100000)),
        contextWindowTokens: Math.max(1, Math.trunc(plan.contextWindowTokens ?? 4096)),
        ragChunkSize: Math.max(256, Math.trunc(plan.ragChunkSize ?? 512)),
        aiModel: plan.aiModel ?? undefined,
        embeddingModel: plan.embeddingModel ?? undefined,
        features: plan.features ?? undefined,
        isActive,
        displayOrder: Math.max(0, toInt(displayOrder, plan.displayOrder ?? 0)),
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
