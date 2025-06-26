
import { useState } from "react";
import { Building, Plus, Settings, Users, CreditCard, Shield, Eye, MoreHorizontal, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { systemAdminApi, type Tenant, type CreateTenantData, validateTenantData } from "@/services/api/system-admin";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const TenantManagementPage = () => {
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [formData, setFormData] = useState<CreateTenantData>({
    name: "",
    domain: "",
    adminEmail: "",
    adminName: "",
    description: "",
    plan: "Basic",
    maxUsers: 100,
    storage: "10GB",
    billingCycle: "Monthly",
    autoActivation: true,
    emailNotifications: true,
    trialPeriod: false
  });

  const { data: tenantsResponse, isLoading, error } = useQuery({
    queryKey: ['tenants', searchTerm],
    queryFn: () => systemAdminApi.getTenants({ 
      search: searchTerm || undefined,
      limit: 50 
    }),
    refetchInterval: 30000,
  });

  const tenants = tenantsResponse?.tenants || [];
  const pagination = tenantsResponse?.pagination;

  const createTenantMutation = useMutation({
    mutationFn: systemAdminApi.createTenant,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      toast.success('Tenant created successfully', {
        description: `${response.tenant.name} has been created with admin user ${response.adminUser.email}`
      });
      setIsCreateDialogOpen(false);
      setValidationErrors([]);
      resetForm();
      
      // Show temporary password info
      if (response.adminUser.tempPassword) {
        toast.info('Admin Login Details', {
          description: `Temporary password: ${response.adminUser.tempPassword}`,
          duration: 10000
        });
      }
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create tenant';
      const errors = error.response?.data?.errors || [];
      
      if (errors.length > 0) {
        setValidationErrors(errors);
      } else {
        toast.error(errorMessage);
      }
    }
  });

  const deleteTenantMutation = useMutation({
    mutationFn: systemAdminApi.deleteTenant,
    onSuccess: (_, tenantId) => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      const deletedTenant = tenants.find(t => t.id === tenantId);
      toast.success('Tenant deleted successfully', {
        description: `${deletedTenant?.name || 'Tenant'} has been permanently deleted`
      });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete tenant');
    }
  });

  const resetForm = () => {
    setFormData({
      name: "",
      domain: "",
      adminEmail: "",
      adminName: "",
      description: "",
      plan: "Basic",
      maxUsers: 100,
      storage: "10GB",
      billingCycle: "Monthly",
      autoActivation: true,
      emailNotifications: true,
      trialPeriod: false
    });
    setValidationErrors([]);
  };

  const handleCreateTenant = () => {
    // Client-side validation
    const errors = validateTenantData(formData);
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    setValidationErrors([]);
    createTenantMutation.mutate(formData);
  };

  const handleDeleteTenant = (tenant: Tenant) => {
    if (window.confirm(`Are you sure you want to delete "${tenant.name}"? This action cannot be undone and will remove all associated data.`)) {
      deleteTenantMutation.mutate(tenant.id);
    }
  };

  const handleTenantAction = (action: string, tenant: Tenant) => {
    switch (action) {
      case 'delete':
        handleDeleteTenant(tenant);
        break;
      default:
        toast.info(`${action} for ${tenant.name} executed`);
    }
  };

  const handleInputChange = (field: keyof CreateTenantData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear validation errors when user starts typing
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Suspended":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "Inactive":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const filteredTenants = tenants.filter(tenant =>
    tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.adminEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) {
    return (
      <div className="space-y-6 p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">Error Loading Tenants</h2>
          <p className="text-muted-foreground mt-2">
            {error instanceof Error ? error.message : 'Failed to load tenant data'}
          </p>
          <Button 
            onClick={() => queryClient.invalidateQueries({ queryKey: ['tenants'] })}
            className="mt-4"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tenants</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{pagination?.totalItems || tenants.length}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tenants</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {tenants.filter(t => t.status === "Active").length}
                </div>
                <p className="text-xs text-muted-foreground">
                  {tenants.length > 0 ? `${Math.round((tenants.filter(t => t.status === "Active").length / tenants.length) * 100)}% of total` : "0% of total"}
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {tenants.reduce((sum, t) => sum + t.employees, 0)}
                </div>
                <p className="text-xs text-muted-foreground">Across all tenants</p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">$12,450</div>
                <p className="text-xs text-muted-foreground">Monthly recurring</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tenant Directory */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <Input
            placeholder="Search tenants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create New Tenant
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Tenant</DialogTitle>
                <DialogDescription>Set up a new tenant organization in the system</DialogDescription>
              </DialogHeader>
              
              {validationErrors.length > 0 && (
                <Alert variant="destructive">
                  <AlertDescription>
                    <ul className="list-disc list-inside">
                      {validationErrors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="plan">Plan & Limits</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tenantName">Organization Name *</Label>
                      <Input 
                        id="tenantName" 
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Enter organization name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="domain">Domain *</Label>
                      <Input 
                        id="domain" 
                        value={formData.domain}
                        onChange={(e) => handleInputChange('domain', e.target.value)}
                        placeholder="company.com"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="adminName">Admin Name *</Label>
                    <Input 
                      id="adminName" 
                      value={formData.adminName}
                      onChange={(e) => handleInputChange('adminName', e.target.value)}
                      placeholder="Enter admin name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="adminEmail">Admin Email *</Label>
                    <Input 
                      id="adminEmail" 
                      type="email" 
                      value={formData.adminEmail}
                      onChange={(e) => handleInputChange('adminEmail', e.target.value)}
                      placeholder="admin@company.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description" 
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Brief description of the organization" 
                    />
                  </div>
                </TabsContent>
                <TabsContent value="plan" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="plan">Subscription Plan</Label>
                      <select 
                        className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md"
                        value={formData.plan}
                        onChange={(e) => handleInputChange('plan', e.target.value)}
                      >
                        <option value="Basic">Basic</option>
                        <option value="Business">Business</option>
                        <option value="Enterprise">Enterprise</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maxUsers">Max Users</Label>
                      <Input 
                        id="maxUsers" 
                        type="number" 
                        value={formData.maxUsers}
                        onChange={(e) => handleInputChange('maxUsers', parseInt(e.target.value) || 0)}
                        placeholder="100"
                        min="1"
                        max="10000"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="storage">Storage Limit</Label>
                      <Input 
                        id="storage" 
                        type="text" 
                        value={formData.storage}
                        onChange={(e) => handleInputChange('storage', e.target.value)}
                        placeholder="10GB" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="billing">Billing Cycle</Label>
                      <select 
                        className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md"
                        value={formData.billingCycle}
                        onChange={(e) => handleInputChange('billingCycle', e.target.value)}
                      >
                        <option value="Monthly">Monthly</option>
                        <option value="Yearly">Yearly</option>
                      </select>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="settings" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Auto Activation</Label>
                      <p className="text-sm text-muted-foreground">Automatically activate tenant after creation</p>
                    </div>
                    <Switch 
                      checked={formData.autoActivation}
                      onCheckedChange={(checked) => handleInputChange('autoActivation', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Send welcome email to admin</p>
                    </div>
                    <Switch 
                      checked={formData.emailNotifications}
                      onCheckedChange={(checked) => handleInputChange('emailNotifications', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Trial Period</Label>
                      <p className="text-sm text-muted-foreground">Enable 30-day trial period</p>
                    </div>
                    <Switch 
                      checked={formData.trialPeriod}
                      onCheckedChange={(checked) => handleInputChange('trialPeriod', checked)}
                    />
                  </div>
                </TabsContent>
              </Tabs>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => {
                  setIsCreateDialogOpen(false);
                  resetForm();
                }}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateTenant}
                  disabled={createTenantMutation.isPending}
                >
                  {createTenantMutation.isPending ? 'Creating...' : 'Create Tenant'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="rounded-md border">
          {isLoading ? (
            <div className="p-4">
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : filteredTenants.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              {searchTerm ? "No tenants found matching your search" : "No tenants available"}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Organization</TableHead>
                  <TableHead>Domain</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Users</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTenants.map((tenant) => (
                  <TableRow key={tenant.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{tenant.name}</div>
                        <div className="text-sm text-muted-foreground">{tenant.adminEmail}</div>
                      </div>
                    </TableCell>
                    <TableCell>{tenant.domain}</TableCell>
                    <TableCell>{tenant.plan}</TableCell>
                    <TableCell>{tenant.employees}/{tenant.maxUsers}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(tenant.status)}`}>
                        {tenant.status}
                      </span>
                    </TableCell>
                    <TableCell>{tenant.createdDate}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleTenantAction("View Details", tenant)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleTenantAction("Configure", tenant)}>
                            <Settings className="mr-2 h-4 w-4" />
                            Configure
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleTenantAction("Billing", tenant)}>
                            <CreditCard className="mr-2 h-4 w-4" />
                            Billing
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleTenantAction("delete", tenant)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
};

export default TenantManagementPage;
