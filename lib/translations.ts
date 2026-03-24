export const translations = {
  vi: {
    // Common
    settings: 'Cài đặt',
    profile: 'Hồ sơ',
    logout: 'Đăng xuất',
    save: 'Lưu',
    cancel: 'Hủy',
    edit: 'Sửa',
    delete: 'Xóa',
    create: 'Tạo',
    search: 'Tìm kiếm',
    close: 'Đóng',
    done: 'Xong',
    
    // Settings Modal
    theme: 'Giao diện',
    language: 'Ngôn ngữ',
    lightMode: 'Sáng',
    darkMode: 'Tối',
    
    // Dashboard - Super Admin
    dashboard: 'Trang chủ',
    analytics: 'Phân tích',
    reports: 'Báo cáo',
    users: 'Người dùng',
    organizations: 'Tổ chức',
    subscriptions: 'Gói đăng ký',
    pricing: 'Bảng giá',
    roles: 'Vai trò',
    staff: 'Nhân viên',
    compliance: 'Tuân thủ',
    onboarding: 'Đăng ký mới',
    system: 'Hệ thống',
    
    // Dashboard - Tenant Admin
    employees: 'Nhân viên',
    departments: 'Phòng ban',
    documents: 'Tài liệu',
    subscription: 'Gói đăng ký',
    tenantAdmin: 'Quản trị tổ chức',
    management: 'Quản lý',
    currentPlan: 'Gói hiện tại',
    usersLabel: 'Người dùng',
    storage: 'Dung lượng',
    backToHome: 'Về trang chủ',
    
    // Stats & Metrics
    totalUsers: 'Tổng người dùng',
    activeUsers: 'Người dùng hoạt động',
    totalRevenue: 'Tổng doanh thu',
    monthlyRevenue: 'Doanh thu tháng',
    totalOrganizations: 'Tổng tổ chức',
    activeOrganizations: 'Tổ chức hoạt động',
    openSidebar: 'Mở thanh bên',
    superAdmin: 'Quản trị hệ thống',
    platformMenu: 'Menu nền tảng',
    systemStatus: 'Trạng thái hệ thống',
    healthy: 'Ổn định',
    uptime: 'Thời gian hoạt động',
    activeOrgs: 'Tổ chức đang hoạt động',
    totalUsersLabel: 'Tổng người dùng',
  },
  en: {
    // Common
    settings: 'Settings',
    profile: 'Profile',
    logout: 'Logout',
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    create: 'Create',
    search: 'Search',
    close: 'Close',
    done: 'Done',
    
    // Settings Modal
    theme: 'Theme',
    language: 'Language',
    lightMode: 'Light',
    darkMode: 'Dark',
    
    // Dashboard - Super Admin
    dashboard: 'Dashboard',
    analytics: 'Analytics',
    reports: 'Reports',
    users: 'Users',
    organizations: 'Organizations',
    subscriptions: 'Subscriptions',
    pricing: 'Pricing',
    roles: 'Roles',
    staff: 'Staff',
    compliance: 'Compliance',
    onboarding: 'Onboarding',
    system: 'System',
    
    // Dashboard - Tenant Admin
    employees: 'Employees',
    departments: 'Departments',
    documents: 'Documents',
    subscription: 'Subscription',
    tenantAdmin: 'Tenant Admin',
    management: 'Management',
    currentPlan: 'Current plan',
    usersLabel: 'Users',
    storage: 'Storage',
    backToHome: 'Back to home',
    
    // Stats & Metrics
    totalUsers: 'Total Users',
    activeUsers: 'Active Users',
    totalRevenue: 'Total Revenue',
    monthlyRevenue: 'Monthly Revenue',
    totalOrganizations: 'Total Organizations',
    activeOrganizations: 'Active Organizations',
    openSidebar: 'Open sidebar',
    superAdmin: 'Super Admin',
    platformMenu: 'Platform menu',
    systemStatus: 'System status',
    healthy: 'Healthy',
    uptime: 'Uptime',
    activeOrgs: 'Active orgs',
    totalUsersLabel: 'Total users',
  },
};

export type TranslationKey = keyof typeof translations.vi;

export function useTranslation() {
  // This will be replaced with actual hook in components
  return (key: TranslationKey) => key;
}
