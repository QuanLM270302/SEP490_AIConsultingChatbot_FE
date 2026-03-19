import { fetchWithAuth } from "./fetchWithAuth";
import { STAFF_BASE } from "./config";

export type TenantStatus = "PENDING" | "ACTIVE" | "REJECTED" | "SUSPENDED";

export type TransactionStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";

export interface Transaction {
  id: string;
  tenantId: string;
  tenantName: string;
  amount: number;
  currency: string;
  status: TransactionStatus;
  description?: string;
  createdAt: string;
  updatedAt?: string;
  paymentMethod?: string;
  transactionType?: string;
}

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

export async function rejectTenant(tenantId: string, reason: string): Promise<{ message: string }> {
  console.log("API Call - rejectTenant:", { tenantId, reason });
  
  // Try with query parameter first
  const urlWithQuery = `${STAFF_BASE}/tenants/${tenantId}/reject?reason=${encodeURIComponent(reason)}`;
  console.log("Request URL (with query):", urlWithQuery);
  
  let res = await fetchWithAuth(urlWithQuery, {
    method: "PUT",
  });
  
  console.log("Response status (PUT with query):", res.status);
  
  // If 500 error, try with body instead
  if (res.status === 500) {
    console.log("Retrying with body instead of query parameter...");
    const urlWithoutQuery = `${STAFF_BASE}/tenants/${tenantId}/reject`;
    console.log("Request URL (with body):", urlWithoutQuery);
    
    res = await fetchWithAuth(urlWithoutQuery, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reason }),
    });
    
    console.log("Response status (PUT with body):", res.status);
  }
  
  const data = await res.json().catch((err) => {
    console.error("Failed to parse JSON:", err);
    return {};
  });
  
  console.log("Response data:", data);
  
  if (!res.ok) {
    const errorMsg = data?.message || "Từ chối thất bại";
    console.error("API Error:", errorMsg);
    throw new Error(errorMsg);
  }
  
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

// Transaction APIs
export async function getTransactions(): Promise<Transaction[]> {
  const res = await fetchWithAuth(`${STAFF_BASE}/transactions`);
  if (!res.ok) throw new Error("Không tải được danh sách giao dịch");
  return res.json();
}

export async function getTransactionById(transactionId: string): Promise<Transaction> {
  const res = await fetchWithAuth(`${STAFF_BASE}/transactions/${transactionId}`);
  if (!res.ok) {
    if (res.status === 404) throw new Error("Không tìm thấy giao dịch");
    throw new Error("Không tải được chi tiết giao dịch");
  }
  return res.json();
}

export async function getTransactionsByTenant(tenantId: string): Promise<Transaction[]> {
  const res = await fetchWithAuth(`${STAFF_BASE}/transactions/tenants/${tenantId}`);
  if (!res.ok) throw new Error("Không tải được giao dịch của tenant");
  return res.json();
}
