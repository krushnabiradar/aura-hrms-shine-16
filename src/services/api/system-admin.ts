import { api } from '@/lib/axios';
import { AxiosResponse } from 'axios';

export interface Tenant {
  id: string;
  name: string;
  domain: string;
  adminEmail: string;
  description?: string;
  plan: string;
  maxUsers: number;
  storage: string;
  billingCycle: string;
  autoActivation: boolean;
  emailNotifications: boolean;
  trialPeriod: boolean;
  employees: number;
  status: 'Active' | 'Inactive' | 'Suspended';
  createdAt: string;
  updatedAt: string;
  subscription: string;
  createdDate: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'system_admin' | 'tenant_admin' | 'employee';
  status: 'Active' | 'Inactive';
  tenantId?: string;
  tenantName?: string;
  tenantDomain?: string;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Subscription {
  id: string;
  tenantId: string;
  tenantName: string;
  tenantDomain: string;
  plan: string;
  status: 'Active' | 'Inactive' | 'Cancelled' | 'Past_Due';
  startDate: string;
  endDate: string;
  billingCycle: 'Monthly' | 'Yearly';
  amount: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTenantData {
  name: string;
  domain: string;
  adminEmail: string;
  adminName: string;
  description?: string;
  plan?: string;
  maxUsers?: number;
  storage?: string;
  billingCycle?: string;
  autoActivation?: boolean;
  emailNotifications?: boolean;
  trialPeriod?: boolean;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role: 'system_admin' | 'tenant_admin' | 'employee';
  tenantId?: string;
  status?: 'Active' | 'Inactive';
}

export interface CreateSubscriptionData {
  tenantId: string;
  plan: string;
  billingCycle: 'Monthly' | 'Yearly';
  amount: number;
  currency?: string;
}

// Validation functions
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateDomain = (domain: string): boolean => {
  const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
  return domainRegex.test(domain);
};

export const validateTenantData = (data: CreateTenantData): string[] => {
  const errors: string[] = [];
  
  if (!data.name || data.name.trim().length < 2) {
    errors.push('Organization name must be at least 2 characters long');
  }
  
  if (!data.domain || !validateDomain(data.domain)) {
    errors.push('Please provide a valid domain (e.g., company.com)');
  }
  
  if (!data.adminEmail || !validateEmail(data.adminEmail)) {
    errors.push('Please provide a valid admin email address');
  }
  
  if (!data.adminName || data.adminName.trim().length < 2) {
    errors.push('Admin name must be at least 2 characters long');
  }
  
  if (data.maxUsers && (data.maxUsers < 1 || data.maxUsers > 10000)) {
    errors.push('Max users must be between 1 and 10000');
  }
  
  if (data.plan && !['Basic', 'Business', 'Enterprise'].includes(data.plan)) {
    errors.push('Invalid plan selected');
  }
  
  if (data.billingCycle && !['Monthly', 'Yearly'].includes(data.billingCycle)) {
    errors.push('Invalid billing cycle selected');
  }
  
  return errors;
};

export const validateUserData = (data: CreateUserData): string[] => {
  const errors: string[] = [];
  
  if (!data.name || data.name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long');
  }
  
  if (!data.email || !validateEmail(data.email)) {
    errors.push('Please provide a valid email address');
  }
  
  if (!data.password || data.password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }
  
  if (!data.role || !['system_admin', 'tenant_admin', 'employee'].includes(data.role)) {
    errors.push('Invalid role selected');
  }
  
  if (data.role !== 'system_admin' && !data.tenantId) {
    errors.push('Tenant is required for non-system admin users');
  }
  
  return errors;
};

export const validateSubscriptionData = (data: CreateSubscriptionData): string[] => {
  const errors: string[] = [];
  
  if (!data.tenantId) {
    errors.push('Tenant is required');
  }
  
  if (!data.plan || !['Basic', 'Business', 'Enterprise'].includes(data.plan)) {
    errors.push('Invalid plan selected');
  }
  
  if (!data.billingCycle || !['Monthly', 'Yearly'].includes(data.billingCycle)) {
    errors.push('Invalid billing cycle selected');
  }
  
  if (!data.amount || data.amount < 0) {
    errors.push('Amount must be greater than 0');
  }
  
  if (data.currency && !['USD', 'EUR', 'GBP'].includes(data.currency)) {
    errors.push('Invalid currency');
  }
  
  return errors;
};

export interface DashboardStats {
  totalTenants: number;
  activeSubscriptions: number;
  totalUsers: number;
  systemHealth: number;
  trends: {
    tenantGrowth: number;
    userGrowth: number;
    subscriptionGrowth: number;
  };
}

export interface SystemUsage {
  date: string;
  cpu: number;
  memory: number;
  storage: number;
}

export interface SystemLog {
  id: number;
  timestamp: string;
  level: 'INFO' | 'WARNING' | 'ERROR';
  action: string;
  message: string;
  userId?: string;
  userEmail?: string;
  ipAddress: string;
  userAgent: string;
}

export interface NotificationSettings {
  email: {
    enabled: boolean;
    newTenant: boolean;
    userRegistration: boolean;
    paymentFailed: boolean;
    systemAlerts: boolean;
  };
  sms: {
    enabled: boolean;
    criticalAlerts: boolean;
  };
  push: {
    enabled: boolean;
    dashboardAlerts: boolean;
    securityAlerts: boolean;
  };
}

export interface SystemMetrics {
  system: {
    health: number;
    uptime: string;
    lastUpdated: string;
  };
  tenants: {
    total: number;
    active: number;
    newToday: number;
    growthRate: string;
  };
  users: {
    total: number;
    active: number;
    newToday: number;
    activeRate: string;
  };
  security: {
    failedLogins: number;
    activeSessions: number;
    twoFactorEnabled: number;
  };
  resources: {
    cpu: number;
    memory: number;
    storage: number;
    network: number;
  };
  database: {
    connections: number;
    queryTime: number;
    cacheHitRatio: number;
  };
}

export interface PerformanceData {
  timeRange: string;
  dataPoints: Array<{
    timestamp: string;
    cpu: number;
    memory: number;
    storage: number;
    network: number;
    responseTime: number;
    throughput: number;
  }>;
  summary: {
    avgCpu: number;
    avgMemory: number;
    avgResponseTime: number;
    avgThroughput: number;
  };
}

export interface SystemAlert {
  id: number;
  type: 'info' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  resolved: boolean;
}

export interface SupportTicket {
  id: number;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  createdBy: string;
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeArticle {
  id: number;
  title: string;
  content: string;
  category: string;
  tags: string[];
  views: number;
  helpful: number;
  createdAt: string;
  updatedAt: string;
}

export interface ReportType {
  id: string;
  name: string;
  description: string;
  category: string;
}

export const systemAdminApi = {
  // Dashboard Management
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await api.get('/api/system-admin/dashboard/stats');
    return response.data;
  },

  getSystemUsage: async (): Promise<SystemUsage[]> => {
    const response = await api.get('/api/system-admin/dashboard/usage');
    return response.data;
  },

  // System Logs
  getSystemLogs: async (params?: {
    page?: number;
    limit?: number;
    level?: string;
    action?: string;
    startDate?: string;  
    endDate?: string;
  }): Promise<{
    logs: SystemLog[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  }> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.level) searchParams.append('level', params.level);
    if (params?.action) searchParams.append('action', params.action);
    if (params?.startDate) searchParams.append('startDate', params.startDate);
    if (params?.endDate) searchParams.append('endDate', params.endDate);

    const response = await api.get(`/api/system-admin/logs?${searchParams.toString()}`);
    return response.data;
  },

  getAuditLogs: async (params?: {
    page?: number;
    limit?: number;
    userId?: string;
    tenantId?: string;
    action?: string;
  }): Promise<{
    logs: any[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  }> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.userId) searchParams.append('userId', params.userId);
    if (params?.tenantId) searchParams.append('tenantId', params.tenantId);
    if (params?.action) searchParams.append('action', params.action);

    const response = await api.get(`/api/system-admin/logs/audit?${searchParams.toString()}`);
    return response.data;
  },

  // Notification Management
  getNotificationSettings: async (): Promise<NotificationSettings> => {
    const response = await api.get('/api/system-admin/notifications/settings');
    return response.data;
  },

  updateNotificationSettings: async (data: NotificationSettings): Promise<NotificationSettings> => {
    const response = await api.put('/api/system-admin/notifications/settings', data);
    return response.data;
  },

  getNotifications: async (params?: {
    page?: number;
    limit?: number;
    unreadOnly?: boolean;
  }): Promise<{
    notifications: any[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
    unreadCount: number;
  }> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.unreadOnly) searchParams.append('unreadOnly', params.unreadOnly.toString());

    const response = await api.get(`/api/system-admin/notifications?${searchParams.toString()}`);
    return response.data;
  },

  // Tenant Management
  getTenants: async (params?: { page?: number; limit?: number; search?: string; status?: string }): Promise<{
    tenants: Tenant[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  }> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.search) searchParams.append('search', params.search);
    if (params?.status) searchParams.append('status', params.status);

    const response = await api.get(`/api/system-admin/tenants?${searchParams.toString()}`);
    
    // Handle both paginated and non-paginated responses
    if (response.data.tenants) {
      return {
        tenants: response.data.tenants.map((tenant: any) => ({
          ...tenant,
          createdDate: new Date(tenant.createdAt).toLocaleDateString()
        })),
        pagination: response.data.pagination
      };
    } else {
      // Legacy response format
      return {
        tenants: response.data.map((tenant: any) => ({
          ...tenant,
          createdDate: new Date(tenant.createdAt).toLocaleDateString()
        })),
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: response.data.length,
          itemsPerPage: response.data.length
        }
      };
    }
  },
  
  createTenant: async (data: CreateTenantData): Promise<any> => {
    // Client-side validation
    const errors = validateTenantData(data);
    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }
    
    const response = await api.post('/api/system-admin/tenants', data);
    return response.data;
  },
  
  updateTenant: async (id: string, data: Partial<Tenant>): Promise<Tenant> => {
    const response = await api.put(`/api/system-admin/tenants/${id}`, data);
    return response.data.tenant || response.data;
  },
  
  deleteTenant: async (id: string): Promise<void> => {
    await api.delete(`/api/system-admin/tenants/${id}`);
  },
  
  // User Management
  getUsers: async (params?: { page?: number; limit?: number; search?: string; role?: string; tenantId?: string }): Promise<{
    users: User[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  }> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.search) searchParams.append('search', params.search);
    if (params?.role) searchParams.append('role', params.role);
    if (params?.tenantId) searchParams.append('tenantId', params.tenantId);

    const response = await api.get(`/api/system-admin/users?${searchParams.toString()}`);
    
    // Handle both paginated and non-paginated responses
    if (response.data.users) {
      return {
        users: response.data.users,
        pagination: response.data.pagination
      };
    } else {
      // Legacy response format
      return {
        users: response.data,
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: response.data.length,
          itemsPerPage: response.data.length
        }
      };
    }
  },
  
  createUser: async (data: CreateUserData): Promise<User> => {
    // Client-side validation
    const errors = validateUserData(data);
    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }
    
    const response = await api.post('/api/system-admin/users', data);
    return response.data.user || response.data;
  },
  
  updateUser: async (id: string, data: Partial<User>): Promise<User> => {
    const response = await api.put(`/api/system-admin/users/${id}`, data);
    return response.data.user || response.data;
  },
  
  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/api/system-admin/users/${id}`);
  },
  
  // Subscription Management
  getSubscriptions: async (params?: { page?: number; limit?: number; search?: string; status?: string; plan?: string }): Promise<{
    subscriptions: Subscription[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  }> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.search) searchParams.append('search', params.search);
    if (params?.status) searchParams.append('status', params.status);
    if (params?.plan) searchParams.append('plan', params.plan);

    const response = await api.get(`/api/system-admin/subscriptions?${searchParams.toString()}`);
    
    // Handle both paginated and non-paginated responses
    if (response.data.subscriptions) {
      return {
        subscriptions: response.data.subscriptions,
        pagination: response.data.pagination
      };
    } else {
      // Legacy response format
      return {
        subscriptions: response.data,
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: response.data.length,
          itemsPerPage: response.data.length
        }
      };
    }
  },
  
  createSubscription: async (data: CreateSubscriptionData): Promise<Subscription> => {
    // Client-side validation
    const errors = validateSubscriptionData(data);
    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }
    
    const response = await api.post('/api/system-admin/subscriptions', data);
    return response.data.subscription || response.data;
  },
  
  updateSubscription: async (id: string, data: Partial<Subscription>): Promise<Subscription> => {
    const response = await api.put(`/api/system-admin/subscriptions/${id}`, data);
    return response.data.subscription || response.data;
  },
  
  deleteSubscription: async (id: string): Promise<void> => {
    await api.delete(`/api/system-admin/subscriptions/${id}`);
  },
  
  // Settings
  getSettings: () => api.get('/api/system-admin/settings'),
  updateSettings: (data: any) => api.put('/api/system-admin/settings', data),
  
  // Security
  getSecuritySettings: () => api.get('/api/system-admin/security/settings'),
  updateSecuritySettings: (data: any) => api.put('/api/system-admin/security/settings', data),
  getSecurityLogs: () => api.get('/api/system-admin/security/logs'),
  
  // Reports
  getAvailableReports: async (): Promise<ReportType[]> => {
    const response = await api.get('/api/system-admin/reports/available');
    return response.data;
  },

  generateReport: async (data: {
    reportType: string;
    dateRange?: { start: Date; end: Date };
    format?: 'json' | 'csv';
  }): Promise<any> => {
    const response = await api.post('/api/system-admin/reports/generate', data);
    return response.data;
  },

  // Monitoring
  getSystemMetrics: async (): Promise<SystemMetrics> => {
    const response = await api.get('/api/system-admin/monitoring/metrics');
    return response.data;
  },

  getPerformanceMetrics: async (timeRange: string = '24h'): Promise<PerformanceData> => {
    const response = await api.get(`/api/system-admin/monitoring/performance?timeRange=${timeRange}`);
    return response.data;
  },

  getSystemAlerts: async (): Promise<SystemAlert[]> => {
    const response = await api.get('/api/system-admin/monitoring/alerts');
    return response.data;
  },

  // Support
  getSupportTickets: async (params?: {
    status?: string;
    priority?: string;
    category?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    tickets: SupportTicket[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  }> => {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.append('status', params.status);
    if (params?.priority) searchParams.append('priority', params.priority);
    if (params?.category) searchParams.append('category', params.category);
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());

    const response = await api.get(`/api/system-admin/support/tickets?${searchParams.toString()}`);
    return response.data;
  },

  createSupportTicket: async (data: {
    title: string;
    description: string;
    priority?: string;
    category?: string;
  }): Promise<SupportTicket> => {
    const response = await api.post('/api/system-admin/support/tickets', data);
    return response.data;
  },

  updateSupportTicket: async (id: number, data: Partial<SupportTicket>): Promise<SupportTicket> => {
    const response = await api.put(`/api/system-admin/support/tickets/${id}`, data);
    return response.data;
  },

  getKnowledgeBase: async (params?: {
    category?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    articles: KnowledgeArticle[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  }> => {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.append('category', params.category);
    if (params?.search) searchParams.append('search', params.search);
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());

    const response = await api.get(`/api/system-admin/support/knowledge-base?${searchParams.toString()}`);
    return response.data;
  },

  createKnowledgeArticle: async (data: {
    title: string;
    content: string;
    category: string;
    tags?: string[];
  }): Promise<KnowledgeArticle> => {
    const response = await api.post('/api/system-admin/support/knowledge-base', data);
    return response.data;
  },

  getSupportStats: async (): Promise<{
    totalTickets: number;
    openTickets: number;
    inProgressTickets: number;
    resolvedTickets: number;
    highPriorityTickets: number;
    avgResolutionTime: string;
    knowledgeBaseArticles: number;
    totalViews: number;
  }> => {
    const response = await api.get('/api/system-admin/support/stats');
    return response.data;
  }
};
