"use client";

import { useState, useEffect } from "react";
import {
  Check,
  Loader2,
  Eye,
  Filter,
  PauseCircle,
  RotateCcw,
  Trash2,
  X,
  XCircle,
  Building2,
  Mail,
  Users,
  MapPin,
  Globe,
  User,
  Briefcase,
  Phone,
  Info,
  CreditCard,
  Calendar,
} from "lucide-react";
import {
  getTenants,
  getTenantById,
  approveTenant,
  suspendTenant,
  activateTenant,
  rejectTenant,
  deleteTenant,
  type Tenant,
  type TenantStatus,
} from "@/lib/api/staff";
import { useLanguageStore } from "@/lib/language-store";
import { translations } from "@/lib/translations";
import { requestStaffPortalStatsRefresh } from "@/lib/staff-portal-stats-refresh";

const statusLabel: Record<TenantStatus, Record<'vi' | 'en', string>> = {
  PENDING: { vi: "Chờ duyệt", en: "Pending" },
  ACTIVE: { vi: "Đang hoạt động", en: "Active" },
  REJECTED: { vi: "Từ chối", en: "Rejected" },
  SUSPENDED: { vi: "Tạm ngưng", en: "Suspended" },
};

const statusColor: Record<TenantStatus, string> = {
  PENDING: "bg-amber-500/20 text-amber-700 dark:text-amber-400",
  ACTIVE: "bg-emerald-500/20 text-emerald-700 dark:text-emerald-400",
  REJECTED: "bg-red-500/20 text-red-700 dark:text-red-400",
  SUSPENDED: "bg-zinc-500/20 text-zinc-600 dark:text-zinc-400",
};

export default function StaffOrganizationsPage() {
  const { language } = useLanguageStore();
  const t = translations[language];
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [tenantsLoading, setTenantsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<TenantStatus | "ALL">("ALL");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Modals
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectTenantId, setRejectTenantId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTenantId, setDeleteTenantId] = useState<string | null>(null);

  useEffect(() => {
    loadTenants();
  }, []);

  const loadTenants = async () => {
    try {
      setTenantsLoading(true);
      const data = await getTenants();
      setTenants(data);
    } catch (e) {
      console.error("Failed to load tenants:", e);
      setError(language === "en" ? "Failed to load tenants list" : "Không thể tải danh sách tenant");
    } finally {
      setTenantsLoading(false);
    }
  };

  const openRejectModal = (tenantId: string) => {
    setRejectTenantId(tenantId);
    setRejectModalOpen(true);
  };

  const openDetailModal = async (tenantId: string) => {
    setDetailModalOpen(true);
    setSelectedTenant(null);
    try {
      const tenant = await getTenantById(tenantId);
      setSelectedTenant(tenant);
    } catch (e) {
      console.error("Failed to load tenant details:", e);
      setError(language === "en" ? "Failed to load tenant details" : "Không thể tải chi tiết tenant");
    }
  };

  const openDeleteModal = (tenantId: string) => {
    setDeleteTenantId(tenantId);
    setDeleteModalOpen(true);
  };

  const handleApprove = async (tenantId: string) => {
    try {
      setActionLoading(tenantId);
      setError(null);
      await approveTenant(tenantId);
      await loadTenants();
      requestStaffPortalStatsRefresh();
    } catch (e: any) {
      setError(e.message || (language === "en" ? "Cannot approve tenant" : "Không thể phê duyệt tenant"));
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async () => {
    if (!rejectTenantId || !rejectReason.trim()) return;
    try {
      setActionLoading(rejectTenantId);
      setError(null);
      await rejectTenant(rejectTenantId, rejectReason);
      await loadTenants();
      requestStaffPortalStatsRefresh();
      setRejectModalOpen(false);
      setRejectTenantId(null);
      setRejectReason("");
    } catch (e: any) {
      setError(e.message || (language === "en" ? "Cannot reject tenant" : "Không thể từ chối tenant"));
    } finally {
      setActionLoading(null);
    }
  };

  const handleSuspend = async (tenantId: string) => {
    try {
      setActionLoading(tenantId);
      setError(null);
      await suspendTenant(tenantId);
      await loadTenants();
      requestStaffPortalStatsRefresh();
    } catch (e: any) {
      setError(e.message || (language === "en" ? "Cannot suspend tenant" : "Không thể tạm ngưng tenant"));
    } finally {
      setActionLoading(null);
    }
  };

  const handleActivate = async (tenantId: string) => {
    try {
      setActionLoading(tenantId);
      setError(null);
      await activateTenant(tenantId);
      await loadTenants();
    } catch (e: any) {
      setError(e.message || (language === "en" ? "Cannot reactivate tenant" : "Không thể kích hoạt lại tenant"));
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTenantId) return;
    try {
      setActionLoading(deleteTenantId);
      setError(null);
      await deleteTenant(deleteTenantId);
      await loadTenants();
      requestStaffPortalStatsRefresh();
      setDeleteModalOpen(false);
      setDeleteTenantId(null);
    } catch (e: any) {
      setError(e.message || (language === "en" ? "Cannot delete tenant" : "Không thể xóa tenant"));
    } finally {
      setActionLoading(null);
    }
  };

  const filteredTenants =
    statusFilter === "ALL"
      ? tenants
      : tenants.filter((t) => t.status === statusFilter);

  const actionBtnClass =
    "inline-flex h-8 items-center gap-1 rounded-md px-2.5 text-xs font-medium transition disabled:opacity-50";

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            {t.manageOrganizations}
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            {t.organizationsDescription}
          </p>
        </div>

        {/* Tenants Table */}
        {tenantsLoading ? (
          <div className="flex items-center justify-center gap-2 rounded-3xl bg-white p-8 dark:bg-zinc-950">
            <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
            <span className="text-sm text-zinc-500">{t.loadingList}</span>
          </div>
        ) : filteredTenants.length === 0 ? (
          <div className="rounded-3xl border border-zinc-200 bg-white p-8 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
            {t.noTenants}
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-none">
            <div className="border-b border-zinc-200/80 bg-zinc-50/90 px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900/60">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
                    <Filter className="h-4 w-4" />
                  </span>
                  <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{language === "en" ? "Filter" : "Lọc"}</span>
                </div>
                <div className="flex flex-wrap items-center gap-2 rounded-full bg-zinc-100/80 p-1 dark:bg-zinc-800/80">
                  {(["ALL", "PENDING", "ACTIVE", "REJECTED", "SUSPENDED"] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setStatusFilter(s)}
                      className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                        statusFilter === s
                          ? "bg-white text-green-700 shadow-sm ring-1 ring-zinc-200/80 dark:bg-zinc-950 dark:text-green-400 dark:ring-zinc-700"
                          : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
                      }`}
                    >
                      {s === "ALL" ? t.all : statusLabel[s][language]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
                  <tr>
                    <th className="px-6 py-3 font-semibold text-zinc-700 dark:text-zinc-300">{t.nameEmail}</th>
                    <th className="px-6 py-3 font-semibold text-zinc-700 dark:text-zinc-300">{t.status}</th>
                    <th className="px-6 py-3 text-right font-semibold text-zinc-700 dark:text-zinc-300">{t.actions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {filteredTenants.map((tenant) => (
                    <tr
                      key={tenant.id}
                      className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-zinc-900 dark:text-zinc-50">{tenant.name}</div>
                        <div className="text-xs text-zinc-500">{tenant.contactEmail}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor[tenant.status]}`}
                        >
                          {statusLabel[tenant.status][language]}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openDetailModal(tenant.id)}
                            className={`${actionBtnClass} bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700`}
                            title={t.viewDetail}
                          >
                            <Eye className="h-3.5 w-3.5" />
                            <span>{language === "en" ? "Detail" : "Chi tiết"}</span>
                          </button>

                          {tenant.status === "PENDING" && (
                            <>
                              <button
                                type="button"
                                disabled={actionLoading === tenant.id}
                                onClick={() => handleApprove(tenant.id)}
                                className={`${actionBtnClass} bg-emerald-500/90 text-white hover:bg-emerald-600`}
                              >
                                {actionLoading === tenant.id ? (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                  <Check className="h-3.5 w-3.5" />
                                )}
                                <span>{t.approve}</span>
                              </button>
                              <button
                                type="button"
                                disabled={actionLoading === tenant.id}
                                onClick={() => openRejectModal(tenant.id)}
                                className={`${actionBtnClass} bg-red-500/90 text-white hover:bg-red-600`}
                              >
                                <XCircle className="h-3.5 w-3.5" />
                                <span>{t.reject}</span>
                              </button>
                            </>
                          )}
                          {tenant.status === "ACTIVE" && (
                            <button
                              type="button"
                              disabled={actionLoading === tenant.id}
                              onClick={() => handleSuspend(tenant.id)}
                              className={`${actionBtnClass} bg-amber-500/90 text-white hover:bg-amber-600`}
                            >
                              {actionLoading === tenant.id ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <PauseCircle className="h-3.5 w-3.5" />
                              )}
                              <span>{t.suspend}</span>
                            </button>
                          )}
                          {tenant.status === "SUSPENDED" && (
                            <button
                              type="button"
                              disabled={actionLoading === tenant.id}
                              onClick={() => handleActivate(tenant.id)}
                              className={`${actionBtnClass} bg-emerald-500/90 text-white hover:bg-emerald-600`}
                            >
                              {actionLoading === tenant.id ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <RotateCcw className="h-3.5 w-3.5" />
                              )}
                              <span>{t.reactivate}</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => openDeleteModal(tenant.id)}
                            className={`${actionBtnClass} bg-red-600 text-white hover:bg-red-700`}
                            title={t.delete}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>{t.delete}</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

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
              {t.rejectTenant}
            </h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              {t.rejectReason}
            </p>
            
            {error && (
              <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200">
                {error}
              </div>
            )}
            
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder={t.rejectReasonPlaceholder}
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
                {t.cancel}
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
                    {t.processing}
                  </span>
                ) : (
                  t.confirmReject
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl dark:bg-zinc-900">
            <h3 className="text-lg font-semibold text-red-600 dark:text-red-400">
              {t.deleteTenant}
            </h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              {t.deleteConfirm}
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
                {t.cancel}
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
                    {t.deleting}
                  </span>
                ) : (
                  t.confirmDelete
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {detailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-3xl rounded-3xl bg-white shadow-2xl dark:bg-zinc-900 max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 px-8 py-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30">
                  <Building2 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                    {t.tenantDetail}
                  </h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {language === 'vi' ? 'Thông tin chi tiết tổ chức' : 'Organization details'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setDetailModalOpen(false);
                  setSelectedTenant(null);
                }}
                className="rounded-xl p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Content */}
            <div className="flex-1 overflow-y-auto px-8 py-6">
              {!selectedTenant ? (
                <div className="flex items-center justify-center gap-2 py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                  <span className="text-sm text-zinc-500">{t.loading}</span>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Status Card */}
                  <div className="rounded-2xl border-2 border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white dark:bg-zinc-800">
                          <Building2 className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{t.organizationName}</p>
                          <p className="text-lg font-bold text-zinc-900 dark:text-zinc-50">{selectedTenant.name}</p>
                        </div>
                      </div>
                      <span className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${statusColor[selectedTenant.status]}`}>
                        {statusLabel[selectedTenant.status][language]}
                      </span>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
                    <h4 className="mb-4 flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                      <Mail className="h-4 w-4 text-blue-500" />
                      {language === 'vi' ? 'Thông tin liên hệ' : 'Contact Information'}
                    </h4>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="flex items-start gap-3 rounded-xl bg-zinc-50 p-4 dark:bg-zinc-900/50">
                        <Mail className="h-5 w-5 text-zinc-400 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{t.contactEmail}</p>
                          <p className="mt-1 text-sm font-medium text-zinc-900 dark:text-zinc-50 truncate">{selectedTenant.contactEmail}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 rounded-xl bg-zinc-50 p-4 dark:bg-zinc-900/50">
                        <Users className="h-5 w-5 text-zinc-400 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{t.companySize}</p>
                          <p className="mt-1 text-sm font-medium text-zinc-900 dark:text-zinc-50">{selectedTenant.companySize || (language === "en" ? "N/A" : "Không có")}</p>
                        </div>
                      </div>
                    </div>
                    {selectedTenant.address && (
                      <div className="mt-4 flex items-start gap-3 rounded-xl bg-zinc-50 p-4 dark:bg-zinc-900/50">
                        <MapPin className="h-5 w-5 text-zinc-400 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{t.address}</p>
                          <p className="mt-1 text-sm font-medium text-zinc-900 dark:text-zinc-50">{selectedTenant.address}</p>
                        </div>
                      </div>
                    )}
                    {selectedTenant.website && (
                      <div className="mt-4 flex items-start gap-3 rounded-xl bg-zinc-50 p-4 dark:bg-zinc-900/50">
                        <Globe className="h-5 w-5 text-zinc-400 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{t.website}</p>
                          <a href={selectedTenant.website} target="_blank" rel="noopener noreferrer" className="mt-1 text-sm font-medium text-blue-500 hover:text-blue-600 hover:underline truncate block">
                            {selectedTenant.website}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Representative Information */}
                  {(selectedTenant.representativeName || selectedTenant.representativePosition || selectedTenant.representativePhone) && (
                    <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
                      <h4 className="mb-4 flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                        <User className="h-4 w-4 text-blue-500" />
                        {t.representative}
                      </h4>
                      <div className="grid gap-4 sm:grid-cols-2">
                        {selectedTenant.representativeName && (
                          <div className="flex items-start gap-3 rounded-xl bg-zinc-50 p-4 dark:bg-zinc-900/50">
                            <User className="h-5 w-5 text-zinc-400 mt-0.5" />
                            <div className="flex-1">
                              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{language === 'vi' ? 'Họ tên' : 'Full name'}</p>
                              <p className="mt-1 text-sm font-medium text-zinc-900 dark:text-zinc-50">{selectedTenant.representativeName}</p>
                            </div>
                          </div>
                        )}
                        {selectedTenant.representativePosition && (
                          <div className="flex items-start gap-3 rounded-xl bg-zinc-50 p-4 dark:bg-zinc-900/50">
                            <Briefcase className="h-5 w-5 text-zinc-400 mt-0.5" />
                            <div className="flex-1">
                              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{t.position}</p>
                              <p className="mt-1 text-sm font-medium text-zinc-900 dark:text-zinc-50">{selectedTenant.representativePosition}</p>
                            </div>
                          </div>
                        )}
                        {selectedTenant.representativePhone && (
                          <div className="flex items-start gap-3 rounded-xl bg-zinc-50 p-4 dark:bg-zinc-900/50">
                            <Phone className="h-5 w-5 text-zinc-400 mt-0.5" />
                            <div className="flex-1">
                              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{t.phone}</p>
                              <p className="mt-1 text-sm font-medium text-zinc-900 dark:text-zinc-50">{selectedTenant.representativePhone}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* System Information */}
                  <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
                    <h4 className="mb-4 flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                      <Info className="h-4 w-4 text-blue-500" />
                      {language === 'vi' ? 'Thông tin hệ thống' : 'System Information'}
                    </h4>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {selectedTenant.subscriptionId && (
                        <div className="flex items-start gap-3 rounded-xl bg-zinc-50 p-4 dark:bg-zinc-900/50">
                          <CreditCard className="h-5 w-5 text-zinc-400 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{t.subscriptionId}</p>
                            <p className="mt-1 text-xs font-mono font-medium text-zinc-900 dark:text-zinc-50 truncate">{selectedTenant.subscriptionId}</p>
                          </div>
                        </div>
                      )}
                      {selectedTenant.requestedAt && (
                        <div className="flex items-start gap-3 rounded-xl bg-zinc-50 p-4 dark:bg-zinc-900/50">
                          <Calendar className="h-5 w-5 text-zinc-400 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{t.requestDate}</p>
                            <p className="mt-1 text-sm font-medium text-zinc-900 dark:text-zinc-50">
                              {new Date(selectedTenant.requestedAt).toLocaleString(language === 'vi' ? 'vi-VN' : 'en-US')}
                            </p>
                          </div>
                        </div>
                      )}
                      {selectedTenant.reviewedAt && (
                        <div className="flex items-start gap-3 rounded-xl bg-zinc-50 p-4 dark:bg-zinc-900/50">
                          <Calendar className="h-5 w-5 text-zinc-400 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{t.reviewDate}</p>
                            <p className="mt-1 text-sm font-medium text-zinc-900 dark:text-zinc-50">
                              {new Date(selectedTenant.reviewedAt).toLocaleString(language === 'vi' ? 'vi-VN' : 'en-US')}
                            </p>
                          </div>
                        </div>
                      )}
                      {selectedTenant.reviewedBy && (
                        <div className="flex items-start gap-3 rounded-xl bg-zinc-50 p-4 dark:bg-zinc-900/50">
                          <User className="h-5 w-5 text-zinc-400 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{t.reviewer}</p>
                            <p className="mt-1 text-sm font-medium text-zinc-900 dark:text-zinc-50">{selectedTenant.reviewedBy}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
