
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

export const systemAdminApi = {
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
  getSecurityLogs: () => api.get('/api/system-admin/security/logs')
};
