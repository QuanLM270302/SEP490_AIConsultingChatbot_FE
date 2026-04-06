export interface OnboardingModuleResponse {
  id: string;
  title: string;
  summary?: string | null;
  content: string;
  displayOrder: number;
  estimatedMinutes: number;
  requiredPermissions: string[];
  detailFileName?: string | null;
  detailFileType?: string | null;
  detailFileSize?: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string | null;
}

export interface OnboardingProgressResponse {
  moduleId: string;
  readPercent: number;
  completed: boolean;
  completedAt?: string | null;
  lastViewedAt?: string | null;
}

export interface OnboardingMyModuleResponse {
  id: string;
  title: string;
  summary?: string | null;
  content: string;
  displayOrder: number;
  estimatedMinutes: number;
  requiredPermissions: string[];
  detailFileName?: string | null;
  detailFileType?: string | null;
  detailFileSize?: number | null;
  readPercent: number;
  completed: boolean;
  completedAt?: string | null;
  lastViewedAt?: string | null;
}

export interface OnboardingMyOverviewResponse {
  totalModules: number;
  completedModules: number;
  progressPercent: number;
  hasIncompleteModules: boolean;
  modules: OnboardingMyModuleResponse[];
}

export interface CreateOnboardingModuleRequest {
  title: string;
  summary?: string;
  content: string;
  displayOrder?: number;
  estimatedMinutes?: number;
  requiredPermissions?: string[];
}

export interface UpdateOnboardingModuleRequest {
  title?: string;
  summary?: string;
  content?: string;
  displayOrder?: number;
  estimatedMinutes?: number;
  requiredPermissions?: string[];
  isActive?: boolean;
}
