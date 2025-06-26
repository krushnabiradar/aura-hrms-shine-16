import { api } from '@/lib/axios';
import { AxiosResponse } from 'axios';

interface Tenant {
  id: string | number;
  name: string;
  domain: string;
  employees: number;
  status: string;
  plan: string;
  createdDate: string;
  adminEmail: string;
  subscription: string;
  storage: string;
  maxUsers: number;
}

export const systemAdminApi = {
  // Tenant Management
  getTenants: async (): Promise<Tenant[]> => {
    const response: AxiosResponse<Tenant[]> = await api.get('/api/system-admin/tenants');
    return response.data;
  },
  createTenant: (data: Partial<Tenant>) => api.post('/api/system-admin/tenants', data),
  updateTenant: (id: string, data: Partial<Tenant>) => api.put(`/api/system-admin/tenants/${id}`, data),
  
  // User Management
  getUsers: () => api.get('/api/system-admin/users'),
  createUser: (data: any) => api.post('/api/system-admin/users', data),
  updateUser: (id: string, data: any) => api.put(`/api/system-admin/users/${id}`, data),
  
  // Settings
  getSettings: () => api.get('/api/system-admin/settings'),
  updateSettings: (data: any) => api.put('/api/system-admin/settings', data),
  
  // Security
  getSecuritySettings: () => api.get('/api/system-admin/security/settings'),
  updateSecuritySettings: (data: any) => api.put('/api/system-admin/security/settings', data),
  getSecurityLogs: () => api.get('/api/system-admin/security/logs'),
  
  // Billing
  getSubscriptions: () => api.get('/api/system-admin/subscriptions'),
  updateSubscription: (id: string, data: any) => api.put(`/api/system-admin/subscriptions/${id}`, data)
};