import { fetchWithAuth } from "./fetchWithAuth";
import { STAFF_BASE } from "./config";

export type TenantStatus = "PENDING" | "ACTIVE" | "REJECTED" | "SUSPENDED";

export interface Tenant {
  id: string;
  name: string;
  address?: string;
  website?: string;
  companySize?: string;
  contactEmail: string;
  representativeName?: string;
  representativePosition?: string;
  representativePhone?: string;
  requestMessage?: string;
  requestedAt?: string;
  status: TenantStatus;
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  subscriptionId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface StaffDashboardStats {
  tenants: {
    total: number;
    active: number;
    pending: number;
    suspended: number;
    activePercentage?: number;
  };
  totalUsers: number;
  subscriptions: { total: number };
  totalDocuments: number;
}

export async function getStaffDashboard(): Promise<StaffDashboardStats> {
  const res = await fetchWithAuth(`${STAFF_BASE}/analytics/dashboard`);
  if (!res.ok) throw new Error("Không tải được thống kê dashboard");
  return res.json();
}

export async function getTenants(): Promise<Tenant[]> {
  const res = await fetchWithAuth(`${STAFF_BASE}/tenants`);
  if (!res.ok) throw new Error("Không tải được danh sách tenant");
  return res.json();
}

export async function getTenantById(tenantId: string): Promise<Tenant> {
  const res = await fetchWithAuth(`${STAFF_BASE}/tenants/${tenantId}`);
  if (!res.ok) {
    if (res.status === 404) throw new Error("Không tìm thấy tenant");
    throw new Error("Không tải được chi tiết tenant");
  }
  return res.json();
}

export async function approveTenant(tenantId: string): Promise<{ message: string }> {
  const res = await fetchWithAuth(`${STAFF_BASE}/tenants/${tenantId}/approve`, {
    method: "PUT",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || "Phê duyệt thất bại");
  return data;
}

export async function suspendTenant(tenantId: string): Promise<{ message: string }> {
  const res = await fetchWithAuth(`${STAFF_BASE}/tenants/${tenantId}/suspend`, {
    method: "PUT",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || "Tạm ngưng thất bại");
  return data;
}

export async function activateTenant(tenantId: string): Promise<{ message: string }> {
  const res = await fetchWithAuth(`${STAFF_BASE}/tenants/${tenantId}/activate`, {
    method: "PUT",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || "Kích hoạt thất bại");
  return data;
}

export async function deleteTenant(tenantId: string): Promise<{ message: string }> {
  const res = await fetchWithAuth(`${STAFF_BASE}/tenants/${tenantId}`, {
    method: "DELETE",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || "Xóa thất bại");
  return data;
}
