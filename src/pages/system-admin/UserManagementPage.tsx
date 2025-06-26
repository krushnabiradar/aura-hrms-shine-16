
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
import { Skeleton } from "@/components/ui/skeleton";
import { systemAdminApi, type User, type CreateUserData, type Tenant } from "@/services/api/system-admin";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const UserManagementPage = () => {
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [formData, setFormData] = useState<CreateUserData>({
    name: "",
    email: "",
    password: "",
    role: "employee",
    tenantId: "",
    status: "Active"
  });

  const { data: users = [], isLoading: usersLoading, error: usersError } = useQuery({
    queryKey: ['users'],
    queryFn: systemAdminApi.getUsers,
    refetchInterval: 30000,
  });

  const { data: tenants = [] } = useQuery({
    queryKey: ['tenants'],
    queryFn: systemAdminApi.getTenants,
  });

  const createUserMutation = useMutation({
    mutationFn: systemAdminApi.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User created successfully');
      setIsCreateDialogOpen(false);
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "employee",
        tenantId: "",
        status: "Active"
      });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create user');
    }
  });

  const deleteUserMutation = useMutation({
    mutationFn: systemAdminApi.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  });

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.tenantName && user.tenantName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRole = filterRole === "all" || user.role.toLowerCase().includes(filterRole.toLowerCase());
    return matchesSearch && matchesRole;
  });

  const handleCreateUser = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.role) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (formData.role !== 'system_admin' && !formData.tenantId) {
      toast.error('Please select a tenant for non-system admin users');
      return;
    }

    createUserMutation.mutate(formData);
  };

  const handleUserAction = (action: string, user: User) => {
    switch (action) {
      case 'Delete User':
        if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
          deleteUserMutation.mutate(user.id);
        }
        break;
      default:
        toast.info(`${action} for ${user.name} executed`);
    }
  };

  const handleInputChange = (field: keyof CreateUserData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Inactive":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "Suspended":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "system_admin":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "tenant_admin":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "employee":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const formatRoleDisplay = (role: string) => {
    switch (role) {
      case "system_admin":
        return "System Admin";
      case "tenant_admin":
        return "Tenant Admin";
      case "employee":
        return "Employee";
      default:
        return role;
    }
  };

  if (usersError) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">Error Loading Users</h2>
          <p className="text-muted-foreground mt-2">
            {usersError instanceof Error ? usersError.message : 'Failed to load user data'}
          </p>
          <Button 
            onClick={() => queryClient.invalidateQueries({ queryKey: ['users'] })}
            className="mt-4"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

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
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="userName">Full Name *</Label>
                  <Input 
                    id="userName" 
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="John Doe" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="userEmail">Email Address *</Label>
                  <Input 
                    id="userEmail" 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="john.doe@company.com" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="userPassword">Password *</Label>
                <Input 
                  id="userPassword" 
                  type="password" 
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Enter password" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="userRole">User Role *</Label>
                  <select 
                    id="userRole"
                    className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md"
                    value={formData.role}
                    onChange={(e) => handleInputChange('role', e.target.value as CreateUserData['role'])}
                  >
                    <option value="employee">Employee</option>
                    <option value="tenant_admin">Tenant Admin</option>
                    <option value="system_admin">System Admin</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="userTenant">Tenant Organization</Label>
                  <select 
                    id="userTenant"
                    className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md"
                    value={formData.tenantId}
                    onChange={(e) => handleInputChange('tenantId', e.target.value)}
                    disabled={formData.role === 'system_admin'}
                  >
                    <option value="">Select Tenant</option>
                    {tenants.map(tenant => (
                      <option key={tenant.id} value={tenant.id}>{tenant.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Account Active</Label>
                  <p className="text-sm text-muted-foreground">User can log in to the system</p>
                </div>
                <Switch 
                  checked={formData.status === 'Active'}
                  onCheckedChange={(checked) => handleInputChange('status', checked ? 'Active' : 'Inactive')}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
              <Button 
                onClick={handleCreateUser}
                disabled={createUserMutation.isPending}
              >
                {createUserMutation.isPending ? 'Creating...' : 'Create User'}
              </Button>
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
            {usersLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">{users.length}</div>
                <p className="text-xs text-muted-foreground">Across all tenants</p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Admins</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {usersLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">{users.filter(u => u.role === "system_admin").length}</div>
                <p className="text-xs text-muted-foreground">Super admin access</p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {usersLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">{users.filter(u => u.status === "Active").length}</div>
                <p className="text-xs text-muted-foreground">Currently active</p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tenant Admins</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {usersLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">{users.filter(u => u.role === "tenant_admin").length}</div>
                <p className="text-xs text-muted-foreground">Tenant administrators</p>
              </>
            )}
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
          {usersLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[150px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
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
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      {searchTerm || filterRole !== "all" ? "No users found matching your criteria" : "No users available"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} />
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
                          {formatRoleDisplay(user.role)}
                        </span>
                      </TableCell>
                      <TableCell>{user.tenantName || 'System'}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(user.status)}`}>
                          {user.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm">{user.lastLogin || 'Never'}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleUserAction("Edit User", user)}>
                              Edit User
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleUserAction("Reset Password", user)}>
                              Reset Password
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleUserAction("View Permissions", user)}>
                              View Permissions
                            </DropdownMenuItem>
                            {user.role !== 'system_admin' && (
                              <DropdownMenuItem 
                                onClick={() => handleUserAction("Delete User", user)}
                                className="text-red-600"
                              >
                                Delete User
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagementPage;
