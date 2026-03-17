import { fetchWithAuth } from "@/lib/api/fetchWithAuth";
import { TENANT_ADMIN_BASE } from "@/lib/api/config";

export interface TenantDashboardResponse {
  totalUsers?: number;
  documents?: {
    totalDocuments?: number;
    totalChunks?: number;
    averageChunksPerDocument?: number;
  };
  llmUsage?: {
    totalTokensUsed?: number;
    totalRequests?: number;
    requestsThisMonth?: number;
  };
}

export interface TenantAnalyticsResponse {
  totalUsers?: number;
  activeUsers?: number;
  newUsersThisMonth?: number;
  usersByRole?: Record<string, number>;
  usersByDepartment?: Record<string, number>;
  usersCreatedLast7Days?: number;
  usersCreatedLast30Days?: number;
}

export interface UserResponse {
  id: string;
  email?: string;
  fullName?: string;
  departmentId?: number;
  departmentName?: string;
  roleId?: number;
  roleName?: string;
  status?: string;
  createdAt?: string;
}

export interface DepartmentResponse {
  id: number;
  name?: string;
  code?: string;
  description?: string;
  parentId?: number;
  isActive?: boolean;
  employeeCount?: number;
}

export interface RoleResponse {
  id: number;
  name?: string;
  code?: string;
  description?: string;
  usersCount?: number;
}

export async function getTenantDashboard(): Promise<TenantDashboardResponse> {
  const res = await fetchWithAuth(`${TENANT_ADMIN_BASE}/dashboard`);
  if (!res.ok) throw new Error(await res.text().catch(() => "Failed to load dashboard"));
  return res.json();
}

export async function getTenantAnalytics(): Promise<TenantAnalyticsResponse> {
  const res = await fetchWithAuth(`${TENANT_ADMIN_BASE}/dashboard/analytics`);
  if (!res.ok) throw new Error(await res.text().catch(() => "Failed to load analytics"));
  return res.json();
}

export async function getTenantUsers(status: string = "ACTIVE"): Promise<UserResponse[]> {
  const res = await fetchWithAuth(`${TENANT_ADMIN_BASE}/users?status=${status}`);
  if (!res.ok) throw new Error(await res.text().catch(() => "Failed to load users"));
  return res.json();
}

export async function getTenantDepartments(): Promise<DepartmentResponse[]> {
  const res = await fetchWithAuth(`${TENANT_ADMIN_BASE}/departments`);
  if (!res.ok) throw new Error(await res.text().catch(() => "Failed to load departments"));
  return res.json();
}

export async function getTenantRoles(): Promise<RoleResponse[]> {
  const res = await fetchWithAuth(`${TENANT_ADMIN_BASE}/roles`);
  if (!res.ok) throw new Error(await res.text().catch(() => "Failed to load roles"));
  return res.json();
}
