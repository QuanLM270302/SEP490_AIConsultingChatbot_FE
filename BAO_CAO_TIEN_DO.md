# Báo cáo tiến độ – Internal Consultant AI Chatbot (Frontend)

**Dự án:** SEP490 – Web app Internal Consultant AI Chatbot  
**Cập nhật:** Tháng 2/2025

---

## 1. Phần đã hoàn thành (Đã làm)

### 1.1 Xác thực và phân quyền
- **Đăng nhập** (`/login`): Form đăng nhập, giao diện 2 cột (form + panel trang trí).
- **Quên mật khẩu** (`/forgot-password`): Luồng khôi phục mật khẩu.
- **AuthGuard**: Bảo vệ route theo role, refresh token, chuyển hướng theo quyền.
- **Phân quyền theo role**: `ROLE_EMPLOYEE`, `ROLE_STAFF`, `ROLE_TENANT_ADMIN`, `ROLE_SUPER_ADMIN`; map path → role trong `lib/auth-routes.ts`.
- **API auth**: Login, refresh, lưu token/user trong store (`lib/auth-store.ts`, `lib/api/auth.ts`).

### 1.2 Trang chủ / Dashboard
- **Trang chủ công khai** (`/`): Hero, giới thiệu tính năng (Hỏi đáp AI, Tài liệu tập trung, Bảo mật & phân quyền, Nâng cấp linh hoạt), nút Đăng nhập.
- **Dashboard Super Admin**: Header, MetricsSection, QuestionsChart, DashboardRightSidebar (khi đăng nhập Super Admin).

### 1.3 Khu vực Nhân viên (Employee)
- **Trang chủ Employee** (`/employee`): EmployeeHeader, StatsCards, ActionCards, ProSection, GuideSection, ProModal.
- **Chat platform** (`/employee/chatplatform`):  
  - Danh sách tin nhắn, sidebar lịch sử chat, input gửi câu hỏi.  
  - Hiển thị câu trả lời, references (tài liệu tham chiếu), rating (helpful / not-helpful).  
  - AIBoxSidebar, ChatHeader; format câu trả lời (Markdown), thẻ tham chiếu.  
  - *Hiện dùng dữ liệu mẫu / simulate API.*
- **Subscription** (`/employee/subscription`): Chọn gói (Starter, Standard, Enterprise), SubscriptionTiers, block “Đề xuất” gửi thông báo tới Tenant Admin.

### 1.4 Khu vực Staff
- **Staff Dashboard** (`/staff`):  
  - Các card chức năng chính: Review Tenant Requests, Approve / Reject Tenant, Assign Subscriptions, Monitor Platform Activity, Send Notifications.

### 1.5 Khu vực Tenant Admin
- **Layout**: TenantAdminLayout, TenantAdminSidebar, DashboardHeader.
- **Dashboard** (`/tenant-admin`): OrganizationStats, EmployeeOverview, DepartmentOverview, DepartmentStructure.
- **Nhân viên** (`/tenant-admin/employees`): EmployeesTable.
- **Phòng ban** (`/tenant-admin/departments`): DepartmentsTable.
- **Vai trò** (`/tenant-admin/roles`): RolesTable, PermissionsMatrix.

### 1.6 Khu vực Super Admin
- **Layout**: SuperAdminLayout, SuperAdminSidebar.
- **Dashboard** (`/super-admin`): PlatformStats, OnboardingStats, RecentActivity.
- **Tổ chức** (`/super-admin/organizations`): OrganizationsTable.
- **Onboarding** (`/super-admin/onboarding`): OnboardingRequests.
- **Pricing** (`/super-admin/pricing`): SubscriptionPlans, PricingTiers.
- **Báo cáo** (`/super-admin/reports`): ReportsOverview, RevenueCharts, PerformanceCharts, UsageStatistics.
- **Hệ thống** (`/super-admin/system`): SystemHealth, SystemMetrics, ServiceStatus.
- **Compliance** (`/super-admin/compliance`): CompliancePolicies, AuditLogs, DataIsolation.

### 1.7 Profile và Subscription chung
- **Profile** (`/profile`): Xem thông tin cá nhân, cập nhật (số điện thoại, ngày sinh, địa chỉ), đổi mật khẩu; tích hợp API `lib/api/profile.ts`.
- **Subscription** (`/subscription`): Redirect sang `/employee/subscription`.

### 1.8 Giao diện và hạ tầng
- **Layout**: AppHeader, AppSidebar (dùng cho employee).
- **UI cơ bản**: Button, Input, Select (`components/ui`).
- **Auth**: AuthForm, LogoutButton.
- **Công nghệ**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Heroicons, Lucide.

---

## 2. Phần đang làm (Đang làm)

- **Tích hợp API thật cho Chat**: Chat platform đang dùng `setTimeout` mô phỏng API; cần nối với backend RAG/chat để gửi câu hỏi và nhận câu trả lời + references.
- **Các đường dẫn từ Content Manager**: Nút “Quản lý tài liệu”, “Quản lý thẻ”, “Chạy re-indexing”, “Cấu hình quy tắc”, “Xem analytics” đang để `href: "#"`; cần tạo route và trang tương ứng hoặc gắn link đúng.
- **Đồng bộ độ dài nội dung**: Đã chỉnh nội dung các card (content manager, subscription) để mô tả/câu chữ tương đồng, cùng số dòng; có thể còn chỉnh thêm cho đồng nhất giữa các trang.

---

## 3. Phần chuẩn bị làm (Chuẩn bị làm)

### 3.1 Content Manager – Trang chức năng
- **Quản lý tài liệu**: Trang upload, chỉnh sửa, phân loại, xóa tài liệu nội bộ; tích hợp API tài liệu.
- **Gắn thẻ tài liệu**: Trang quản lý tag (HR, IT, Operations, Finance…), gán/bỏ tag cho tài liệu.
- **Ingestion & Re-indexing**: Trang/modal kích hoạt ingestion và re-indexing; gọi API backend.
- **Quy tắc hiển thị**: Trang cấu hình visibility/access cho nội dung nhạy cảm.
- **Analytics & Insights**: Trang xem FAQ, thống kê sử dụng tài liệu, hiệu suất hệ thống; có thể dùng chung API với dashboard.

### 3.2 Chat và RAG
- Kết nối chat với backend (RAG): gửi câu hỏi, nhận stream/response, hiển thị references và rating.
- Lưu lịch sử chat (theo user/session) nếu backend hỗ trợ.
- (Tùy chọn) Trang lịch sử chat riêng (`/employee/history` hoặc tương đương).

### 3.3 Subscription và thanh toán
- Luồng gửi đề xuất nâng cấp từ Employee tới Tenant Admin (API + thông báo/email).
- Trang quản lý gói/thanh toán phía Tenant Admin (nếu có).
- (Tùy chọn) Tích hợp thanh toán (invoice, payment method) nếu product yêu cầu.

### 3.4 Cải thiện chung
- **Metadata SEO**: Đổi `title`/`description` trong `layout.tsx` cho phù hợp sản phẩm.
- **Error/Loading**: Bổ sung `error.tsx`, `loading.tsx` cho từng nhóm route nếu cần.
- **404**: Trang `not-found.tsx` thân thiện với người dùng.
- **API**: Mở rộng `lib/api` (documents, tags, analytics, re-index, visibility rules…) khi backend sẵn sàng.
- **Test**: Unit/Integration test cho auth, profile, và các luồng chính.

---

## Tóm tắt

| Hạng mục              | Trạng thái   | Ghi chú ngắn                                      |
|-----------------------|-------------|---------------------------------------------------|
| Auth (login, forgot, guard) | ✅ Hoàn thành | Có API, phân quyền theo role                      |
| Home / Dashboard      | ✅ Hoàn thành | Guest + Super Admin view                          |
| Employee (home, chat, subscription) | ✅ Hoàn thành | Chat đang mock API                                |
| Staff home            | ✅ Hoàn thành | Card chức năng theo use case Staff                |
| Tenant Admin          | ✅ Hoàn thành | Dashboard, employees, departments, roles         |
| Super Admin           | ✅ Hoàn thành | Đủ trang con theo sidebar                        |
| Profile               | ✅ Hoàn thành | Xem/sửa thông tin, đổi mật khẩu                   |
| Chat API thật         | 🔄 Đang làm | Thay mock bằng backend RAG                        |
| Trang con Staff           | 📋 Chuẩn bị | Chi tiết màn duyệt tenant, gán subscription       |
| Subscription flow     | 📋 Chuẩn bị | Đề xuất nâng cấp, thông báo Tenant Admin          |

Nếu cần bổ sung thêm mục (ví dụ: i18n, dark mode cố định, responsive từng trang) hoặc đính kèm tiến độ theo sprint, có thể cập nhật trực tiếp vào file này.
