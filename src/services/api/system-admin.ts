
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

export const systemAdminApi = {
  // Tenant Management
  getTenants: async (): Promise<Tenant[]> => {
    const response: AxiosResponse<Tenant[]> = await api.get('/api/system-admin/tenants');
    return response.data.map(tenant => ({
      ...tenant,
      createdDate: new Date(tenant.createdAt).toLocaleDateString()
    }));
  },
  
  createTenant: async (data: CreateTenantData): Promise<any> => {
    const response = await api.post('/api/system-admin/tenants', data);
    return response.data;
  },
  
  updateTenant: async (id: string, data: Partial<Tenant>): Promise<Tenant> => {
    const response = await api.put(`/api/system-admin/tenants/${id}`, data);
    return response.data;
  },
  
  // User Management
  getUsers: async (): Promise<User[]> => {
    const response: AxiosResponse<User[]> = await api.get('/api/system-admin/users');
    return response.data;
  },
  
  createUser: async (data: CreateUserData): Promise<User> => {
    const response = await api.post('/api/system-admin/users', data);
    return response.data;
  },
  
  updateUser: async (id: string, data: Partial<User>): Promise<User> => {
    const response = await api.put(`/api/system-admin/users/${id}`, data);
    return response.data;
  },
  
  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/api/system-admin/users/${id}`);
  },
  
  // Subscription Management
  getSubscriptions: async (): Promise<Subscription[]> => {
    const response: AxiosResponse<Subscription[]> = await api.get('/api/system-admin/subscriptions');
    return response.data;
  },
  
  createSubscription: async (data: CreateSubscriptionData): Promise<Subscription> => {
    const response = await api.post('/api/system-admin/subscriptions', data);
    return response.data;
  },
  
  updateSubscription: async (id: string, data: Partial<Subscription>): Promise<Subscription> => {
    const response = await api.put(`/api/system-admin/subscriptions/${id}`, data);
    return response.data;
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
