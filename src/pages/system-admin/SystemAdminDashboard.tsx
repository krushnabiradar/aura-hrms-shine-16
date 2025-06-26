import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Building, Briefcase, Users, Activity, CreditCard, Database, BarChart3 } from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { SystemAdminSidebar } from "@/components/sidebars/SystemAdminSidebar";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { useQuery } from "@tanstack/react-query";
import { systemAdminApi } from "@/services/api/system-admin";

// Import the existing pages
import TenantManagementPage from "./TenantManagementPage";
import UserManagementPage from "./UserManagementPage";
import BillingSubscriptionPage from "./BillingSubscriptionPage";

// Import the new Phase 4 components
import { NotificationPreferences } from "@/components/notifications/NotificationPreferences";
import { ReportBuilder } from "@/components/reports/ReportBuilder";
import { SystemSettings } from "@/components/settings/SystemSettings";

// Import new pages
import SecurityManagementPage from "./SecurityManagementPage";
import SystemLogsPage from "./SystemLogsPage";

const SystemAdminDashboard = () => {
  const location = useLocation();
  
  // Fetch real dashboard statistics
  const { data: dashboardStats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => systemAdminApi.getDashboardStats(),
    refetchInterval: 30000,
  });

  // Fetch recent tenants for the table
  const { data: tenantsData, isLoading: tenantsLoading } = useQuery({
    queryKey: ['recent-tenants'],
    queryFn: () => systemAdminApi.getTenants({ limit: 5 }),
  });

  const tenants = tenantsData?.tenants || [];

  const handleAddTenant = () => {
    toast.info("Add tenant functionality not implemented yet");
  };

  // Route to appropriate page based on current path
  const renderPageContent = () => {
    switch (location.pathname) {
      case "/system-admin/tenants":
        return <TenantManagementPage />;
      case "/system-admin/users":
        return <UserManagementPage />;
      case "/system-admin/billing":
        return <BillingSubscriptionPage />;
      case "/system-admin/security":
        return <SecurityManagementPage />;
      case "/system-admin/analytics":
        return <ReportBuilder />;
      case "/system-admin/logs":
        return <SystemLogsPage />;
      case "/system-admin/settings":
        return <SystemSettings />;
      case "/system-admin/help":
        return <div className="p-8 text-center text-muted-foreground">Help & support coming soon...</div>;
      default:
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">System Dashboard</h2>
              <p className="text-muted-foreground">Monitor and manage all tenants from a central location.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <DashboardCard
                title="Total Tenants"
                value={statsLoading ? "Loading..." : dashboardStats?.totalTenants?.toString() || "0"}
                icon={Building}
                trend={dashboardStats?.trends?.tenantGrowth}
                trendLabel="from last month"
              />
              <DashboardCard
                title="Active Subscriptions"
                value={statsLoading ? "Loading..." : dashboardStats?.activeSubscriptions?.toString() || "0"}
                icon={CreditCard}
                trend={dashboardStats?.trends?.subscriptionGrowth}
                trendLabel="from last month"
              />
              <DashboardCard
                title="Total Users"
                value={statsLoading ? "Loading..." : dashboardStats?.totalUsers?.toString() || "0"}
                icon={Users}
                trend={dashboardStats?.trends?.userGrowth}
                trendLabel="from last month"
              />
              <DashboardCard
                title="System Health"
                value={statsLoading ? "Loading..." : `${dashboardStats?.systemHealth || 0}%`}
                icon={Activity}
                description="All systems operational"
              />
            </div>

            <Card className="col-span-3">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Tenants</CardTitle>
                  <CardDescription>
                    Recently registered tenant organizations.
                  </CardDescription>
                </div>
                <Button onClick={handleAddTenant}>Add Tenant</Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tenant</TableHead>
                      <TableHead>Employees</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tenantsLoading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center">
                          Loading tenant data...
                        </TableCell>
                      </TableRow>
                    ) : tenants.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground">
                          No tenants found
                        </TableCell>
                      </TableRow>
                    ) : (
                      tenants.map((tenant) => (
                        <TableRow key={tenant.id}>
                          <TableCell className="font-medium">{tenant.name}</TableCell>
                          <TableCell>{tenant.employees || 0}</TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                              tenant.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                              tenant.status === 'Inactive' || tenant.status === 'Suspended' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                              'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            }`}>
                              {tenant.status}
                            </span>
                          </TableCell>
                          <TableCell>{tenant.plan}</TableCell>
                          <TableCell>{tenant.createdDate}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" onClick={() => toast.info(`View ${tenant.name} details`)}>
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>System Usage</CardTitle>
                  <CardDescription>Resource utilization across the platform</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <BarChart3 className="h-16 w-16" />
                    <p>Usage analytics chart will appear here</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Database Status</CardTitle>
                  <CardDescription>Real-time database performance metrics</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Database className="h-16 w-16" />
                    <p>Database metrics will appear here</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
    }
  };

  return (
    <DashboardLayout sidebar={<SystemAdminSidebar />}>
      {renderPageContent()}
    </DashboardLayout>
  );
};

export default SystemAdminDashboard;
