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
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'system_admin' | 'tenant_admin' | 'employee';
  status: 'Active' | 'Inactive';
  tenantId?: string;
  lastLogin?: string;
}

export interface SystemSettings {
  general: {
    companyName: string;
    timezone: string;
    dateFormat: string;
    currency: string;
  };
  security: {
    passwordPolicy: {
      minLength: number;
      requireUppercase: boolean;
      requireNumbers: boolean;
      requireSpecialChars: boolean;
    };
    mfaEnabled: boolean;
    sessionTimeout: number;
  };
}