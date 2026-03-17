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
  contactEmail?: string;
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

// ---------- User management (align with API 11) ----------
export async function getTenantUserById(userId: string): Promise<UserResponse> {
  const res = await fetchWithAuth(`${TENANT_ADMIN_BASE}/users/${userId}`);
  if (!res.ok) throw new Error(await res.text().catch(() => "Failed to load user"));
  return res.json();
}

export interface CreateUserRequest {
  fullName: string;
  contactEmail: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  address?: string;
  roleId: number;
  departmentId?: number;
  permissions?: string[];
}

export interface UpdateUserRequest {
  fullName?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  address?: string;
  departmentId?: number;
  roleId?: number;
}

export async function createTenantUser(body: CreateUserRequest): Promise<UserResponse> {
  const res = await fetchWithAuth(`${TENANT_ADMIN_BASE}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text().catch(() => "Failed to create user"));
  return res.json();
}

export async function updateTenantUser(userId: string, body: UpdateUserRequest): Promise<UserResponse> {
  const res = await fetchWithAuth(`${TENANT_ADMIN_BASE}/users/${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text().catch(() => "Failed to update user"));
  return res.json();
}

export async function updateTenantUserPermissions(userId: string, permissions: string[]): Promise<UserResponse> {
  const res = await fetchWithAuth(`${TENANT_ADMIN_BASE}/users/${userId}/permissions`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ permissions }),
  });
  if (!res.ok) throw new Error(await res.text().catch(() => "Failed to update permissions"));
  return res.json();
}

export async function activateTenantUser(userId: string): Promise<UserResponse> {
  const res = await fetchWithAuth(`${TENANT_ADMIN_BASE}/users/${userId}/activate`, { method: "PUT" });
  if (!res.ok) throw new Error(await res.text().catch(() => "Failed to activate user"));
  return res.json();
}

export async function deactivateTenantUser(userId: string): Promise<UserResponse> {
  const res = await fetchWithAuth(`${TENANT_ADMIN_BASE}/users/${userId}/deactivate`, { method: "PUT" });
  if (!res.ok) throw new Error(await res.text().catch(() => "Failed to deactivate user"));
  return res.json();
}

export async function deleteTenantUser(userId: string): Promise<{ message: string }> {
  const res = await fetchWithAuth(`${TENANT_ADMIN_BASE}/users/${userId}`, { method: "DELETE" });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || "Failed to delete user");
  return data;
}

export async function resetTenantUserPassword(userId: string): Promise<{ message: string }> {
  const res = await fetchWithAuth(`${TENANT_ADMIN_BASE}/users/${userId}/reset-password`, { method: "POST" });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || "Failed to reset password");
  return data;
}

// ---------- Department management (align with API 12) ----------
export async function getTenantDepartmentById(departmentId: number): Promise<DepartmentResponse> {
  const res = await fetchWithAuth(`${TENANT_ADMIN_BASE}/departments/${departmentId}`);
  if (!res.ok) throw new Error(await res.text().catch(() => "Failed to load department"));
  return res.json();
}

export async function getTenantActiveDepartments(): Promise<DepartmentResponse[]> {
  const res = await fetchWithAuth(`${TENANT_ADMIN_BASE}/departments/active`);
  if (!res.ok) throw new Error(await res.text().catch(() => "Failed to load active departments"));
  return res.json();
}

export interface CreateDepartmentRequest {
  code: string;
  name: string;
  description?: string;
}

export interface UpdateDepartmentRequest {
  code?: string;
  name?: string;
  description?: string;
  parentId?: number;
  isActive?: boolean;
}

export async function createTenantDepartment(body: CreateDepartmentRequest): Promise<DepartmentResponse> {
  const res = await fetchWithAuth(`${TENANT_ADMIN_BASE}/departments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text().catch(() => "Failed to create department"));
  return res.json();
}

export async function updateTenantDepartment(departmentId: number, body: UpdateDepartmentRequest): Promise<DepartmentResponse> {
  const res = await fetchWithAuth(`${TENANT_ADMIN_BASE}/departments/${departmentId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text().catch(() => "Failed to update department"));
  return res.json();
}

export async function deleteTenantDepartment(departmentId: number): Promise<{ message: string }> {
  const res = await fetchWithAuth(`${TENANT_ADMIN_BASE}/departments/${departmentId}`, { method: "DELETE" });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || "Failed to delete department");
  return data;
}

// ---------- Role management (align with API 13) ----------
export async function getTenantRoleById(roleId: number): Promise<RoleResponse> {
  const res = await fetchWithAuth(`${TENANT_ADMIN_BASE}/roles/${roleId}`);
  if (!res.ok) throw new Error(await res.text().catch(() => "Failed to load role"));
  return res.json();
}

export async function getTenantCustomRoles(): Promise<RoleResponse[]> {
  const res = await fetchWithAuth(`${TENANT_ADMIN_BASE}/roles/custom`);
  if (!res.ok) throw new Error(await res.text().catch(() => "Failed to load custom roles"));
  return res.json();
}

export async function getTenantFixedRoles(): Promise<RoleResponse[]> {
  const res = await fetchWithAuth(`${TENANT_ADMIN_BASE}/roles/fixed`);
  if (!res.ok) throw new Error(await res.text().catch(() => "Failed to load fixed roles"));
  return res.json();
}

/** Backend returns { category, permissions: { code, ... }[] }[]; we flatten to { code }[] */
export async function getTenantAvailablePermissions(): Promise<{ code: string; name?: string }[]> {
  const res = await fetchWithAuth(`${TENANT_ADMIN_BASE}/roles/permissions/available`);
  if (!res.ok) throw new Error(await res.text().catch(() => "Failed to load permissions"));
  const categories: { category?: string; permissions?: { code: string }[] }[] = await res.json();
  const flat: { code: string }[] = [];
  categories.forEach((c) => c.permissions?.forEach((p) => flat.push({ code: p.code })));
  return flat;
}

export interface CreateRoleRequest {
  code: string;
  name: string;
  description?: string;
  permissions: string[];
}

export interface UpdateRoleRequest {
  name?: string;
  description?: string;
  permissions?: string[];
}

export async function createTenantRole(body: CreateRoleRequest): Promise<RoleResponse> {
  const res = await fetchWithAuth(`${TENANT_ADMIN_BASE}/roles`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text().catch(() => "Failed to create role"));
  return res.json();
}

export async function updateTenantRole(roleId: number, body: UpdateRoleRequest): Promise<RoleResponse> {
  const res = await fetchWithAuth(`${TENANT_ADMIN_BASE}/roles/${roleId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text().catch(() => "Failed to update role"));
  return res.json();
}

export async function deleteTenantRole(roleId: number): Promise<{ message: string }> {
  const res = await fetchWithAuth(`${TENANT_ADMIN_BASE}/roles/${roleId}`, { method: "DELETE" });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || "Failed to delete role");
  return data;
}
