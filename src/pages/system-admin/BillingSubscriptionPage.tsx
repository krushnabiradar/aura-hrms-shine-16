
import { useState } from "react";
import { CreditCard, DollarSign, TrendingUp, Package, MoreHorizontal, Download, Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { systemAdminApi, type Subscription, type CreateSubscriptionData, type Tenant } from "@/services/api/system-admin";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const BillingSubscriptionPage = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState<CreateSubscriptionData>({
    tenantId: "",
    plan: "Basic",
    billingCycle: "Monthly",
    amount: 29,
    currency: "USD"
  });

  const { data: subscriptionsData, isLoading: subscriptionsLoading, error: subscriptionsError } = useQuery({
    queryKey: ['subscriptions'],
    queryFn: () => systemAdminApi.getSubscriptions(),
    refetchInterval: 30000,
  });

  const { data: tenantsData } = useQuery({
    queryKey: ['tenants'],
    queryFn: () => systemAdminApi.getTenants(),
  });

  // Extract arrays from the response data
  const subscriptions = subscriptionsData?.subscriptions || [];
  const tenants = tenantsData?.tenants || [];

  const createSubscriptionMutation = useMutation({
    mutationFn: systemAdminApi.createSubscription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      toast.success('Subscription created successfully');
      setIsCreateDialogOpen(false);
      setFormData({
        tenantId: "",
        plan: "Basic",
        billingCycle: "Monthly",
        amount: 29,
        currency: "USD"
      });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create subscription');
    }
  });

  const updateSubscriptionMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Subscription> }) => 
      systemAdminApi.updateSubscription(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      toast.success('Subscription updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update subscription');
    }
  });

  const deleteSubscriptionMutation = useMutation({
    mutationFn: systemAdminApi.deleteSubscription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      toast.success('Subscription deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete subscription');
    }
  });

  const filteredSubscriptions = subscriptions.filter(sub =>
    sub.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.plan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalMRR = subscriptions
    .filter(sub => sub.status === 'Active')
    .reduce((sum, sub) => sum + sub.amount, 0);
  const activeSubscriptions = subscriptions.filter(sub => sub.status === "Active").length;
  const pastDueSubscriptions = subscriptions.filter(sub => sub.status === "Past_Due").length;

  const handleBillingAction = (action: string, subscription: Subscription) => {
    switch (action) {
      case 'Cancel Subscription':
        if (window.confirm(`Are you sure you want to cancel subscription for ${subscription.tenantName}?`)) {
          updateSubscriptionMutation.mutate({
            id: subscription.id,
            data: { status: 'Cancelled' }
          });
        }
        break;
      case 'Delete Subscription':
        if (window.confirm(`Are you sure you want to delete subscription for ${subscription.tenantName}?`)) {
          deleteSubscriptionMutation.mutate(subscription.id);
        }
        break;
      default:
        toast.info(`${action} for ${subscription.tenantName} executed`);
    }
  };

  const handleCreateSubscription = () => {
    if (!formData.tenantId || !formData.plan || !formData.amount) {
      toast.error('Please fill in all required fields');
      return;
    }

    createSubscriptionMutation.mutate(formData);
  };

  const handleInputChange = (field: keyof CreateSubscriptionData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Past_Due":
      case "Cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "Inactive":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatAmount = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  if (subscriptionsError) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">Error Loading Subscriptions</h2>
          <p className="text-muted-foreground mt-2">
            {subscriptionsError instanceof Error ? subscriptionsError.message : 'Failed to load subscription data'}
          </p>
          <Button 
            onClick={() => queryClient.invalidateQueries({ queryKey: ['subscriptions'] })}
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
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Billing & Subscriptions</h2>
        <p className="text-muted-foreground">Manage subscription plans, billing, and revenue analytics</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Recurring Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {subscriptionsLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-2xl font-bold">{formatAmount(totalMRR)}</div>
                <p className="text-xs text-muted-foreground">From active subscriptions</p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {subscriptionsLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">{activeSubscriptions}</div>
                <p className="text-xs text-muted-foreground">
                  {subscriptions.length > 0 ? `${Math.round((activeSubscriptions / subscriptions.length) * 100)}% of total` : "0% of total"}
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Past Due</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {subscriptionsLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold text-red-600">{pastDueSubscriptions}</div>
                <p className="text-xs text-muted-foreground">Requires attention</p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Revenue Per User</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {subscriptionsLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {activeSubscriptions > 0 ? formatAmount(totalMRR / activeSubscriptions) : formatAmount(0)}
                </div>
                <p className="text-xs text-muted-foreground">Per active subscription</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="subscriptions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
        </TabsList>

        <TabsContent value="subscriptions" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Active Subscriptions</CardTitle>
                  <CardDescription>Manage tenant subscriptions and billing cycles</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Subscription
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New Subscription</DialogTitle>
                        <DialogDescription>Add a new subscription for a tenant</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="tenant">Tenant *</Label>
                          <select 
                            id="tenant"
                            className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md"
                            value={formData.tenantId}
                            onChange={(e) => handleInputChange('tenantId', e.target.value)}
                          >
                            <option value="">Select Tenant</option>
                            {tenants.map(tenant => (
                              <option key={tenant.id} value={tenant.id}>{tenant.name}</option>
                            ))}
                          </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="plan">Plan *</Label>
                            <select 
                              id="plan"
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
                            <Label htmlFor="billingCycle">Billing Cycle *</Label>
                            <select 
                              id="billingCycle"
                              className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md"
                              value={formData.billingCycle}
                              onChange={(e) => handleInputChange('billingCycle', e.target.value as 'Monthly' | 'Yearly')}
                            >
                              <option value="Monthly">Monthly</option>
                              <option value="Yearly">Yearly</option>
                            </select>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="amount">Amount *</Label>
                            <Input 
                              id="amount" 
                              type="number" 
                              value={formData.amount}
                              onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
                              placeholder="29.00" 
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="currency">Currency</Label>
                            <select 
                              id="currency"
                              className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md"
                              value={formData.currency}
                              onChange={(e) => handleInputChange('currency', e.target.value)}
                            >
                              <option value="USD">USD</option>
                              <option value="EUR">EUR</option>
                              <option value="GBP">GBP</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
                        <Button 
                          onClick={handleCreateSubscription}
                          disabled={createSubscriptionMutation.isPending}
                        >
                          {createSubscriptionMutation.isPending ? 'Creating...' : 'Create Subscription'}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Input
                    placeholder="Search subscriptions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {subscriptionsLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-4">
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
                      <TableHead>Tenant</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Billing Cycle</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSubscriptions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                          {searchTerm ? "No subscriptions found matching your search" : "No subscriptions available"}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredSubscriptions.map((subscription) => (
                        <TableRow key={subscription.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{subscription.tenantName}</div>
                              <div className="text-sm text-muted-foreground">{subscription.tenantDomain}</div>
                            </div>
                          </TableCell>
                          <TableCell>{subscription.plan}</TableCell>
                          <TableCell>{formatAmount(subscription.amount, subscription.currency)}</TableCell>
                          <TableCell>{subscription.billingCycle}</TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(subscription.status)}`}>
                              {subscription.status}
                            </span>
                          </TableCell>
                          <TableCell>{formatDate(subscription.endDate)}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleBillingAction("View Details", subscription)}>
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleBillingAction("Change Plan", subscription)}>
                                  Change Plan
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleBillingAction("Update Billing", subscription)}>
                                  Update Billing
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleBillingAction("Cancel Subscription", subscription)}>
                                  Cancel Subscription
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleBillingAction("Delete Subscription", subscription)}
                                  className="text-red-600"
                                >
                                  Delete Subscription
                                </DropdownMenuItem>
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BillingSubscriptionPage;
