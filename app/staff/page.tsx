"use client";

import { useState, useEffect } from "react";
import { StaffLayout } from "@/components/staff/StaffLayout";
import {
  Building2,
  FileText,
  CreditCard,
  ClipboardCheck,
  PauseCircle,
  PlayCircle,
  BarChart3,
  Loader2,
} from "lucide-react";
import {
  type StaffDashboardStats,
} from "@/lib/api/staff";
import {
  fetchPlatformDashboard,
  parsePlatformDashboardJson,
} from "@/lib/api/platform-dashboard";
import { useLanguageStore } from "@/lib/language-store";
import { translations } from "@/lib/translations";

export default function StaffDashboardPage() {
  const { language } = useLanguageStore();
  const t = translations[language];
  const [stats, setStats] = useState<StaffDashboardStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = () => {
    setStatsLoading(true);
    setError(null);
    void fetchPlatformDashboard(true)
      .then(({ ok, data }) => {
        if (!ok) throw new Error("Không tải được thống kê dashboard");
        const parsed = parsePlatformDashboardJson(true, data);
        const totalUsersRaw = data.totalUsers;
        const totalUsers =
          typeof totalUsersRaw === "number" && Number.isFinite(totalUsersRaw)
            ? totalUsersRaw
            : parsed.tenants.active;
        setStats({
          tenants: {
            total: parsed.tenants.total,
            active: parsed.tenants.active,
            pending: parsed.tenants.pending,
            suspended: parsed.tenants.suspended,
            ...(parsed.tenants.activePercentage > 0
              ? { activePercentage: parsed.tenants.activePercentage }
              : {}),
          },
          totalUsers,
          subscriptions: { total: parsed.staffSubscriptionsTotal },
          totalDocuments: parsed.staffTotalDocuments,
        });
      })
      .catch((e) => {
        setError(e instanceof Error ? e.message : "Lỗi tải thống kê");
        setStats(null);
      })
      .finally(() => setStatsLoading(false));
  };

  const loadTenants = () => {
    setTenantsLoading(true);
    setError(null);
    getTenants()
      .then(setTenants)
      .catch((e) => setError(e instanceof Error ? e.message : "Lỗi tải danh sách tenant"))
      .finally(() => setTenantsLoading(false));
  };

  const loadTransactions = () => {
    setTransactionsLoading(true);
    setError(null);
    getTransactions()
      .then(setTransactions)
      .catch((e) => setError(e instanceof Error ? e.message : "Lỗi tải danh sách giao dịch"))
      .finally(() => setTransactionsLoading(false));
  };

  useEffect(() => {
    loadDashboard();
    loadTenants();
    loadTransactions();
  }, []);

  const handleApprove = (tenantId: string) => {
    setActionLoading(tenantId);
    approveTenant(tenantId)
      .then(() => {
        loadTenants();
        loadDashboard();
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Lỗi"))
      .finally(() => setActionLoading(null));
  };

  const handleSuspend = (tenantId: string) => {
    setActionLoading(tenantId);
    suspendTenant(tenantId)
      .then(() => {
        loadTenants();
        loadDashboard();
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Lỗi"))
      .finally(() => setActionLoading(null));
  };

  const handleActivate = (tenantId: string) => {
    setActionLoading(tenantId);
    activateTenant(tenantId)
      .then(() => {
        loadTenants();
        loadDashboard();
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Lỗi"))
      .finally(() => setActionLoading(null));
  };

  const openRejectModal = (tenantId: string) => {
    setRejectTenantId(tenantId);
    setRejectReason("");
    setRejectModalOpen(true);
  };

  const handleReject = async () => {
    if (!rejectTenantId || !rejectReason.trim()) {
      setError("Vui lòng nhập lý do từ chối");
      return;
    }
    
    setActionLoading(rejectTenantId);
    setError(null);
    
    try {
      console.log("Rejecting tenant:", rejectTenantId, "with reason:", rejectReason);
      await rejectTenant(rejectTenantId, rejectReason);
      console.log("Reject successful");
      
      // Reload data
      await Promise.all([loadTenants(), loadDashboard()]);
      
      // Close modal
      setRejectModalOpen(false);
      setRejectTenantId(null);
      setRejectReason("");
    } catch (e) {
      console.error("Reject error:", e);
      setError(e instanceof Error ? e.message : "Lỗi khi từ chối tenant");
    } finally {
      setActionLoading(null);
    }
  };

  const openDetailModal = async (tenantId: string) => {
    setDetailModalOpen(true);
    setSelectedTenant(null);
    try {
      const tenant = await getTenantById(tenantId);
      setSelectedTenant(tenant);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Không tải được chi tiết tenant");
      setDetailModalOpen(false);
    }
  };

  const openDeleteModal = (tenantId: string) => {
    setDeleteTenantId(tenantId);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTenantId) return;
    
    setActionLoading(deleteTenantId);
    setError(null);
    
    try {
      await deleteTenant(deleteTenantId);
      await Promise.all([loadTenants(), loadDashboard()]);
      setDeleteModalOpen(false);
      setDeleteTenantId(null);
    } catch (e) {
      console.error("Delete error:", e);
      setError(e instanceof Error ? e.message : "Lỗi khi xóa tenant");
    } finally {
      setActionLoading(null);
    }
  };

  const openTransactionDetailModal = async (transactionId: string) => {
    setTransactionDetailModalOpen(true);
    setSelectedTransaction(null);
    try {
      const transaction = await getTransactionById(transactionId);
      setSelectedTransaction(transaction);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Không tải được chi tiết giao dịch");
      setTransactionDetailModalOpen(false);
    }
  };

  const filteredTransactions =
    transactionStatusFilter === "ALL"
      ? transactions
      : transactions.filter((t) => t.status === transactionStatusFilter);

  const filteredTenants =
    statusFilter === "ALL"
      ? tenants
      : tenants.filter((t) => t.status === statusFilter);

  return (
    <StaffLayout>
      <div className="space-y-10">
        {/* Header */}
        <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 p-6 text-white shadow-xl shadow-emerald-500/30 dark:shadow-emerald-900/40">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {t.staffDashboard}
            </h1>
            <p className="mt-1 max-w-xl text-sm text-emerald-50/90">
              {t.staffDescription}
            </p>
          </div>
        </section>

          {/* 1. Statistics */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-emerald-500" />
              {t.statistics}
            </h2>
            {statsLoading ? (
              <div className="flex items-center justify-center gap-2 rounded-3xl bg-white p-8 dark:bg-zinc-950">
                <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
                <span className="text-sm text-zinc-500">{t.loading}…</span>
              </div>
            ) : stats ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                  icon={Building2}
                  label={t.totalTenants}
                  value={stats.tenants.total}
                />
                <StatCard
                  icon={ClipboardCheck}
                  label={t.pending}
                  value={stats.tenants.pending}
                  accent="amber"
                />
                <StatCard
                  icon={PlayCircle}
                  label={t.active}
                  value={stats.tenants.active}
                  accent="emerald"
                />
                <StatCard
                  icon={PauseCircle}
                  label={t.suspended}
                  value={stats.tenants.suspended}
                  accent="zinc"
                />
                <StatCard
                  icon={CreditCard}
                  label={t.totalSubscriptions}
                  value={stats.subscriptions.total}
                />
                <StatCard
                  icon={FileText}
                  label={t.totalDocuments}
                  value={stats.totalDocuments}
                />
              </div>
            ) : (
              <div className="rounded-3xl bg-white p-6 text-center text-sm text-zinc-500 dark:bg-zinc-950 dark:text-zinc-400">
                {error || t.noData}
              </div>
            )}
          </section>

          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200">
              {error}
            </div>
          )}
        </div>

      {/* Reject Modal */}
      {rejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl dark:bg-zinc-900">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Từ chối tenant
            </h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Vui lòng nhập lý do từ chối yêu cầu onboard của tenant này.
            </p>
            
            {error && (
              <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200">
                {error}
              </div>
            )}
            
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Nhập lý do từ chối..."
              rows={4}
              className="mt-4 w-full rounded-xl border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder-zinc-500"
            />
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setRejectModalOpen(false);
                  setRejectTenantId(null);
                  setRejectReason("");
                  setError(null);
                }}
                disabled={actionLoading !== null}
                className="flex-1 rounded-xl bg-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-300 disabled:opacity-50 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleReject}
                disabled={actionLoading !== null || !rejectReason.trim()}
                className="flex-1 rounded-xl bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50"
              >
                {actionLoading === rejectTenantId ? (
                  <span className="inline-flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Đang xử lý...
                  </span>
                ) : (
                  "Xác nhận từ chối"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {detailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl dark:bg-zinc-900 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                Chi tiết tenant
              </h3>
              <button
                type="button"
                onClick={() => {
                  setDetailModalOpen(false);
                  setSelectedTenant(null);
                }}
                className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {!selectedTenant ? (
              <div className="flex items-center justify-center gap-2 py-8">
                <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
                <span className="text-sm text-zinc-500">Đang tải...</span>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Tên tổ chức</label>
                    <p className="mt-1 text-sm text-zinc-900 dark:text-zinc-50">{selectedTenant.name}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Trạng thái</label>
                    <p className="mt-1">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor[selectedTenant.status]}`}>
                        {statusLabel[selectedTenant.status]}
                      </span>
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Email liên hệ</label>
                    <p className="mt-1 text-sm text-zinc-900 dark:text-zinc-50">{selectedTenant.contactEmail}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Quy mô công ty</label>
                    <p className="mt-1 text-sm text-zinc-900 dark:text-zinc-50">{selectedTenant.companySize || "N/A"}</p>
                  </div>
                  {selectedTenant.address && (
                    <div className="col-span-2">
                      <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Địa chỉ</label>
                      <p className="mt-1 text-sm text-zinc-900 dark:text-zinc-50">{selectedTenant.address}</p>
                    </div>
                  )}
                  {selectedTenant.website && (
                    <div className="col-span-2">
                      <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Website</label>
                      <p className="mt-1 text-sm text-zinc-900 dark:text-zinc-50">
                        <a href={selectedTenant.website} target="_blank" rel="noopener noreferrer" className="text-emerald-500 hover:underline">
                          {selectedTenant.website}
                        </a>
                      </p>
                    </div>
                  )}
                  {selectedTenant.representativeName && (
                    <div>
                      <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Người đại diện</label>
                      <p className="mt-1 text-sm text-zinc-900 dark:text-zinc-50">{selectedTenant.representativeName}</p>
                    </div>
                  )}
                  {selectedTenant.representativePosition && (
                    <div>
                      <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Chức vụ</label>
                      <p className="mt-1 text-sm text-zinc-900 dark:text-zinc-50">{selectedTenant.representativePosition}</p>
                    </div>
                  )}
                  {selectedTenant.representativePhone && (
                    <div>
                      <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Số điện thoại</label>
                      <p className="mt-1 text-sm text-zinc-900 dark:text-zinc-50">{selectedTenant.representativePhone}</p>
                    </div>
                  )}
                  {selectedTenant.subscriptionId && (
                    <div>
                      <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Subscription ID</label>
                      <p className="mt-1 text-xs font-mono text-zinc-900 dark:text-zinc-50">{selectedTenant.subscriptionId}</p>
                    </div>
                  )}
                  {selectedTenant.requestedAt && (
                    <div>
                      <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Ngày yêu cầu</label>
                      <p className="mt-1 text-sm text-zinc-900 dark:text-zinc-50">
                        {new Date(selectedTenant.requestedAt).toLocaleString("vi-VN")}
                      </p>
                    </div>
                  )}
                  {selectedTenant.reviewedAt && (
                    <div>
                      <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Ngày duyệt</label>
                      <p className="mt-1 text-sm text-zinc-900 dark:text-zinc-50">
                        {new Date(selectedTenant.reviewedAt).toLocaleString("vi-VN")}
                      </p>
                    </div>
                  )}
                  {selectedTenant.reviewedBy && (
                    <div>
                      <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Người duyệt</label>
                      <p className="mt-1 text-sm text-zinc-900 dark:text-zinc-50">{selectedTenant.reviewedBy}</p>
                    </div>
                  )}
                </div>
                {selectedTenant.requestMessage && (
                  <div>
                    <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Tin nhắn yêu cầu</label>
                    <p className="mt-1 text-sm text-zinc-900 dark:text-zinc-50 whitespace-pre-wrap">{selectedTenant.requestMessage}</p>
                  </div>
                )}
                {selectedTenant.rejectionReason && (
                  <div>
                    <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Lý do từ chối</label>
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400 whitespace-pre-wrap">{selectedTenant.rejectionReason}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl dark:bg-zinc-900">
            <h3 className="text-lg font-semibold text-red-600 dark:text-red-400">
              Xác nhận xóa tenant
            </h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Bạn có chắc chắn muốn xóa tenant này? Hành động này không thể hoàn tác.
            </p>
            
            {error && (
              <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200">
                {error}
              </div>
            )}
            
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setDeleteModalOpen(false);
                  setDeleteTenantId(null);
                  setError(null);
                }}
                disabled={actionLoading !== null}
                className="flex-1 rounded-xl bg-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-300 disabled:opacity-50 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={actionLoading !== null}
                className="flex-1 rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                {actionLoading === deleteTenantId ? (
                  <span className="inline-flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Đang xóa...
                  </span>
                ) : (
                  "Xác nhận xóa"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transaction Detail Modal */}
      {transactionDetailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl dark:bg-zinc-900 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                Chi tiết giao dịch
              </h3>
              <button
                type="button"
                onClick={() => {
                  setTransactionDetailModalOpen(false);
                  setSelectedTransaction(null);
                }}
                className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {!selectedTransaction ? (
              <div className="flex items-center justify-center gap-2 py-8">
                <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
                <span className="text-sm text-zinc-500">Đang tải...</span>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">ID Giao dịch</label>
                    <p className="mt-1 text-xs font-mono text-zinc-900 dark:text-zinc-50">{selectedTransaction.id}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Trạng thái</label>
                    <p className="mt-1">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${transactionStatusColor[selectedTransaction.status]}`}>
                        {transactionStatusLabel[selectedTransaction.status]}
                      </span>
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Tenant</label>
                    <p className="mt-1 text-sm text-zinc-900 dark:text-zinc-50">{selectedTransaction.tenantName}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Tenant ID</label>
                    <p className="mt-1 text-xs font-mono text-zinc-900 dark:text-zinc-50">{selectedTransaction.tenantId}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Số tiền</label>
                    <p className="mt-1 text-lg font-semibold text-emerald-600 dark:text-emerald-400">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: selectedTransaction.currency || "VND",
                      }).format(selectedTransaction.amount)}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Đơn vị tiền tệ</label>
                    <p className="mt-1 text-sm text-zinc-900 dark:text-zinc-50">{selectedTransaction.currency || "VND"}</p>
                  </div>
                  {selectedTransaction.paymentMethod && (
                    <div>
                      <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Phương thức thanh toán</label>
                      <p className="mt-1 text-sm text-zinc-900 dark:text-zinc-50">{selectedTransaction.paymentMethod}</p>
                    </div>
                  )}
                  {selectedTransaction.transactionType && (
                    <div>
                      <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Loại giao dịch</label>
                      <p className="mt-1 text-sm text-zinc-900 dark:text-zinc-50">{selectedTransaction.transactionType}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Ngày tạo</label>
                    <p className="mt-1 text-sm text-zinc-900 dark:text-zinc-50">
                      {new Date(selectedTransaction.createdAt).toLocaleString("vi-VN")}
                    </p>
                  </div>
                  {selectedTransaction.updatedAt && (
                    <div>
                      <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Ngày cập nhật</label>
                      <p className="mt-1 text-sm text-zinc-900 dark:text-zinc-50">
                        {new Date(selectedTransaction.updatedAt).toLocaleString("vi-VN")}
                      </p>
                    </div>
                  )}
                </div>
                {selectedTransaction.description && (
                  <div>
                    <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Mô tả</label>
                    <p className="mt-1 text-sm text-zinc-900 dark:text-zinc-50 whitespace-pre-wrap">{selectedTransaction.description}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </StaffLayout>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  accent = "emerald",
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  accent?: "emerald" | "amber" | "zinc";
}) {
  const bg =
    accent === "amber"
      ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
      : accent === "zinc"
        ? "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400"
        : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
  return (
    <div className="rounded-3xl bg-white p-5 shadow-lg shadow-emerald-500/5 ring-1 ring-zinc-200/80 dark:bg-zinc-950 dark:ring-zinc-800">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{label}</p>
          <p className="mt-1 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">{value}</p>
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${bg}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
