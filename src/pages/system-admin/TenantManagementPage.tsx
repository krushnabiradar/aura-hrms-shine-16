
import { useState } from "react";
import { Building, Plus, Settings, Users, CreditCard, Shield, Eye, MoreHorizontal } from "lucide-react";
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

// Mock data
const tenants = [
  {
    id: 1,
    name: "Acme Corporation",
    domain: "acme.com",
    employees: 245,
    status: "Active",
    plan: "Enterprise",
    createdDate: "2023-01-15",
    adminEmail: "admin@acme.com",
    subscription: "Annual",
    storage: "15.2 GB",
    maxUsers: 500
  },
  {
    id: 2,
    name: "Globex Industries",
    domain: "globex.com",
    employees: 112,
    status: "Active",
    plan: "Business",
    createdDate: "2023-03-22",
    adminEmail: "hr@globex.com",
    subscription: "Monthly",
    storage: "8.7 GB",
    maxUsers: 200
  },
  {
    id: 3,
    name: "Stark Innovations",
    domain: "stark.com",
    employees: 89,
    status: "Suspended",
    plan: "Business",
    createdDate: "2023-02-10",
    adminEmail: "admin@stark.com",
    subscription: "Monthly",
    storage: "6.3 GB",
    maxUsers: 200
  },
  {
    id: 4,
    name: "Wayne Enterprises",
    domain: "wayne.com",
    employees: 320,
    status: "Active",
    plan: "Enterprise",
    createdDate: "2023-01-05",
    adminEmail: "bruce@wayne.com",
    subscription: "Annual",
    storage: "22.1 GB",
    maxUsers: 1000
  }
];

const TenantManagementPage = () => {
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTenants = tenants.filter(tenant =>
    tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.domain.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateTenant = () => {
    toast.success("Tenant created successfully");
    setIsCreateDialogOpen(false);
  };

  const handleTenantAction = (action: string, tenantName: string) => {
    toast.info(`${action} for ${tenantName} executed`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Suspended":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Tenant Management</h2>
          <p className="text-muted-foreground">Manage all tenant organizations in the system</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Tenant
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Tenant</DialogTitle>
              <DialogDescription>Set up a new tenant organization in the system</DialogDescription>
            </DialogHeader>
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="plan">Plan & Limits</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tenantName">Organization Name</Label>
                    <Input id="tenantName" placeholder="Enter organization name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="domain">Domain</Label>
                    <Input id="domain" placeholder="company.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adminEmail">Admin Email</Label>
                  <Input id="adminEmail" type="email" placeholder="admin@company.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Brief description of the organization" />
                </div>
              </TabsContent>
              <TabsContent value="plan" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="plan">Subscription Plan</Label>
                    <select className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md">
                      <option>Starter</option>
                      <option>Business</option>
                      <option>Enterprise</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxUsers">Max Users</Label>
                    <Input id="maxUsers" type="number" placeholder="100" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="storage">Storage Limit (GB)</Label>
                    <Input id="storage" type="number" placeholder="10" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="billing">Billing Cycle</Label>
                    <select className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md">
                      <option>Monthly</option>
                      <option>Annual</option>
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
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Send welcome email to admin</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Trial Period</Label>
                    <p className="text-sm text-muted-foreground">Enable 30-day trial period</p>
                  </div>
                  <Switch />
                </div>
              </TabsContent>
            </Tabs>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateTenant}>Create Tenant</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tenants</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tenants.length}</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tenants</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tenants.filter(t => t.status === "Active").length}</div>
            <p className="text-xs text-muted-foreground">85% of total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tenants.reduce((sum, t) => sum + t.employees, 0)}</div>
            <p className="text-xs text-muted-foreground">Across all tenants</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,450</div>
            <p className="text-xs text-muted-foreground">Monthly recurring</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Tenant Directory</CardTitle>
              <CardDescription>Manage all tenant organizations</CardDescription>
            </div>
            <Input
              placeholder="Search tenants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
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
                        <DropdownMenuItem onClick={() => handleTenantAction("View Details", tenant.name)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleTenantAction("Configure", tenant.name)}>
                          <Settings className="mr-2 h-4 w-4" />
                          Configure
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleTenantAction("Billing", tenant.name)}>
                          <CreditCard className="mr-2 h-4 w-4" />
                          Billing
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default TenantManagementPage;
