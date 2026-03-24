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
    openSidebar: 'Mở thanh bên',
    languageEnglish: 'Tiếng Anh',
    languageVietnamese: 'Tiếng Việt',
    signingOut: 'Đang đăng xuất…',
    logOut: 'Đăng xuất',
    aiChatbot: 'Trợ lý AI',
    superAdmin: 'Quản trị hệ thống',
    tenantAdmin: 'Quản trị tổ chức',
    platformMenu: 'Menu nền tảng',
    management: 'Quản lý',
    systemStatus: 'Trạng thái hệ thống',
    healthy: 'Ổn định',
    uptime: 'Thời gian hoạt động',
    activeOrgs: 'Tổ chức hoạt động',
    totalUsersLabel: 'Tổng người dùng',
    currentPlan: 'Gói hiện tại',
    usersLabel: 'Người dùng',
    storage: 'Dung lượng',
    backToHome: 'Về trang chủ',
    
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
    
    // Stats & Metrics
    totalUsers: 'Tổng người dùng',
    activeUsers: 'Người dùng hoạt động',
    totalRevenue: 'Tổng doanh thu',
    monthlyRevenue: 'Doanh thu tháng',
    totalOrganizations: 'Tổng tổ chức',
    activeOrganizations: 'Tổ chức hoạt động',
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
    openSidebar: 'Open sidebar',
    languageEnglish: 'English',
    languageVietnamese: 'Vietnamese',
    signingOut: 'Signing out…',
    logOut: 'Log out',
    aiChatbot: 'AI Chatbot',
    superAdmin: 'Super Admin',
    tenantAdmin: 'Tenant Admin',
    platformMenu: 'Platform Menu',
    management: 'Management',
    systemStatus: 'System Status',
    healthy: 'Healthy',
    uptime: 'Uptime',
    activeOrgs: 'Active Orgs',
    totalUsersLabel: 'Total Users',
    currentPlan: 'Current Plan',
    usersLabel: 'Users',
    storage: 'Storage',
    backToHome: 'Back to home',
    
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
    
    // Stats & Metrics
    totalUsers: 'Total Users',
    activeUsers: 'Active Users',
    totalRevenue: 'Total Revenue',
    monthlyRevenue: 'Monthly Revenue',
    totalOrganizations: 'Total Organizations',
    activeOrganizations: 'Active Organizations',
  },
};

export type TranslationKey = keyof typeof translations.vi;

export function useTranslation() {
  // This will be replaced with actual hook in components
  return (key: TranslationKey) => key;
}
