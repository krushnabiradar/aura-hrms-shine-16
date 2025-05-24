
import { useState } from "react";
import { Users, Plus, Shield, Mail, MoreHorizontal, Search } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/components/ui/sonner";

// Mock data
const systemUsers = [
  {
    id: 1,
    name: "System Administrator",
    email: "admin@aurahrms.com",
    role: "System Admin",
    tenant: "System",
    status: "Active",
    lastLogin: "2024-01-15 10:30",
    permissions: ["Full Access"],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin"
  },
  {
    id: 2,
    name: "John Smith",
    email: "john@acme.com",
    role: "Tenant Admin",
    tenant: "Acme Corporation",
    status: "Active",
    lastLogin: "2024-01-14 16:45",
    permissions: ["Tenant Management", "User Management"],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john"
  },
  {
    id: 3,
    name: "Sarah Johnson",
    email: "sarah@globex.com",
    role: "HR Manager",
    tenant: "Globex Industries",
    status: "Active",
    lastLogin: "2024-01-14 14:20",
    permissions: ["Employee Management", "Leave Management"],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah"
  },
  {
    id: 4,
    name: "Mike Wilson",
    email: "mike@stark.com",
    role: "Employee",
    tenant: "Stark Innovations",
    status: "Suspended",
    lastLogin: "2024-01-10 09:15",
    permissions: ["Basic Access"],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike"
  }
];

const roles = [
  { value: "system_admin", label: "System Admin", permissions: ["Full System Access"] },
  { value: "tenant_admin", label: "Tenant Admin", permissions: ["Tenant Management", "User Management", "Billing"] },
  { value: "hr_manager", label: "HR Manager", permissions: ["Employee Management", "Leave Management", "Attendance"] },
  { value: "employee", label: "Employee", permissions: ["Basic Access", "Profile Management"] }
];

const UserManagementPage = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  const filteredUsers = systemUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.tenant.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || user.role.toLowerCase().includes(filterRole.toLowerCase());
    return matchesSearch && matchesRole;
  });

  const handleCreateUser = () => {
    toast.success("User created successfully");
    setIsCreateDialogOpen(false);
  };

  const handleUserAction = (action: string, userName: string) => {
    toast.info(`${action} for ${userName} executed`);
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

  const getRoleColor = (role: string) => {
    switch (role) {
      case "System Admin":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "Tenant Admin":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "HR Manager":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
          <p className="text-muted-foreground">Manage system users, roles, and permissions</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create User
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
              <DialogDescription>Add a new user to the system with specific roles and permissions</DialogDescription>
            </DialogHeader>
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="role">Role & Access</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="John" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Doe" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="john.doe@company.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tenant">Tenant Organization</Label>
                  <select className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md">
                    <option value="">Select Tenant</option>
                    <option value="acme">Acme Corporation</option>
                    <option value="globex">Globex Industries</option>
                    <option value="stark">Stark Innovations</option>
                  </select>
                </div>
              </TabsContent>
              <TabsContent value="role" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="role">User Role</Label>
                  <select className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md">
                    {roles.map(role => (
                      <option key={role.value} value={role.value}>{role.label}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-4">
                  <Label>Permissions</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch id="perm1" />
                      <Label htmlFor="perm1">User Management</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="perm2" />
                      <Label htmlFor="perm2">Tenant Management</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="perm3" />
                      <Label htmlFor="perm3">Billing Access</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="perm4" />
                      <Label htmlFor="perm4">System Analytics</Label>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="settings" className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Account Active</Label>
                    <p className="text-sm text-muted-foreground">User can log in to the system</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Verification Required</Label>
                    <p className="text-sm text-muted-foreground">User must verify email before access</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Require 2FA for this user</p>
                  </div>
                  <Switch />
                </div>
              </TabsContent>
            </Tabs>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateUser}>Create User</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemUsers.length}</div>
            <p className="text-xs text-muted-foreground">Across all tenants</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Admins</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemUsers.filter(u => u.role === "System Admin").length}</div>
            <p className="text-xs text-muted-foreground">Super admin access</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemUsers.filter(u => u.status === "Active").length}</div>
            <p className="text-xs text-muted-foreground">Currently online</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Invites</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Awaiting response</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>User Directory</CardTitle>
              <CardDescription>Manage system users and their access permissions</CardDescription>
            </div>
            <div className="flex gap-2">
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="all">All Roles</option>
                <option value="system">System Admin</option>
                <option value="tenant">Tenant Admin</option>
                <option value="hr">HR Manager</option>
                <option value="employee">Employee</option>
              </select>
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Tenant</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </TableCell>
                  <TableCell>{user.tenant}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm">{user.lastLogin}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleUserAction("Edit User", user.name)}>
                          Edit User
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUserAction("Reset Password", user.name)}>
                          Reset Password
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUserAction("View Permissions", user.name)}>
                          View Permissions
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUserAction("Suspend User", user.name)}>
                          Suspend User
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

export default UserManagementPage;
