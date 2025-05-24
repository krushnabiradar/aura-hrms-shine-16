
import { useState } from "react";
import { CreditCard, DollarSign, TrendingUp, Package, MoreHorizontal, Download } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/sonner";

// Mock data
const subscriptions = [
  {
    id: 1,
    tenant: "Acme Corporation",
    plan: "Enterprise",
    price: "$299/month",
    status: "Active",
    nextBilling: "2024-02-15",
    users: 245,
    features: ["Unlimited Users", "Advanced Analytics", "Priority Support"],
    mrr: 299
  },
  {
    id: 2,
    tenant: "Globex Industries",
    plan: "Business",
    price: "$149/month",
    status: "Active",
    nextBilling: "2024-02-20",
    users: 112,
    features: ["Up to 200 Users", "Standard Analytics", "Email Support"],
    mrr: 149
  },
  {
    id: 3,
    tenant: "Stark Innovations",
    plan: "Business",
    price: "$149/month",
    status: "Past Due",
    nextBilling: "2024-01-20",
    users: 89,
    features: ["Up to 200 Users", "Standard Analytics", "Email Support"],
    mrr: 0
  },
  {
    id: 4,
    tenant: "Wayne Enterprises",
    plan: "Enterprise",
    price: "$299/month",
    status: "Active",
    nextBilling: "2024-02-10",
    users: 320,
    features: ["Unlimited Users", "Advanced Analytics", "Priority Support"],
    mrr: 299
  }
];

const billingHistory = [
  {
    id: 1,
    tenant: "Acme Corporation",
    amount: "$299.00",
    date: "2024-01-15",
    status: "Paid",
    invoiceId: "INV-001234",
    method: "Credit Card"
  },
  {
    id: 2,
    tenant: "Globex Industries",
    amount: "$149.00",
    date: "2024-01-20",
    status: "Paid",
    invoiceId: "INV-001235",
    method: "Bank Transfer"
  },
  {
    id: 3,
    tenant: "Wayne Enterprises",
    amount: "$299.00",
    date: "2024-01-10",
    status: "Paid",
    invoiceId: "INV-001236",
    method: "Credit Card"
  },
  {
    id: 4,
    tenant: "Stark Innovations",
    amount: "$149.00",
    date: "2024-01-20",
    status: "Failed",
    invoiceId: "INV-001237",
    method: "Credit Card"
  }
];

const plans = [
  {
    name: "Starter",
    price: "$49",
    period: "per month",
    features: ["Up to 50 Users", "Basic Analytics", "Email Support", "5GB Storage"],
    limits: { users: 50, storage: 5 }
  },
  {
    name: "Business",
    price: "$149",
    period: "per month",
    features: ["Up to 200 Users", "Standard Analytics", "Priority Email Support", "25GB Storage"],
    limits: { users: 200, storage: 25 }
  },
  {
    name: "Enterprise",
    price: "$299",
    period: "per month",
    features: ["Unlimited Users", "Advanced Analytics", "Phone Support", "100GB Storage"],
    limits: { users: "Unlimited", storage: 100 }
  }
];

const BillingSubscriptionPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSubscriptions = subscriptions.filter(sub =>
    sub.tenant.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.plan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredBilling = billingHistory.filter(bill =>
    bill.tenant.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill.invoiceId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalMRR = subscriptions.reduce((sum, sub) => sum + sub.mrr, 0);
  const activeSubscriptions = subscriptions.filter(sub => sub.status === "Active").length;
  const pastDueSubscriptions = subscriptions.filter(sub => sub.status === "Past Due").length;

  const handleBillingAction = (action: string, item: string) => {
    toast.info(`${action} for ${item} executed`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
      case "Paid":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Past Due":
      case "Failed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

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
            <div className="text-2xl font-bold">${totalMRR.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+15.2% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeSubscriptions}</div>
            <p className="text-xs text-muted-foreground">87% retention rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Past Due</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{pastDueSubscriptions}</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Revenue Per User</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$24.50</div>
            <p className="text-xs text-muted-foreground">+8.3% from last month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="subscriptions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          <TabsTrigger value="billing">Billing History</TabsTrigger>
          <TabsTrigger value="plans">Plan Configuration</TabsTrigger>
        </TabsList>

        <TabsContent value="subscriptions" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Active Subscriptions</CardTitle>
                  <CardDescription>Manage tenant subscriptions and billing cycles</CardDescription>
                </div>
                <Input
                  placeholder="Search subscriptions..."
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
                    <TableHead>Tenant</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Users</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Next Billing</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubscriptions.map((subscription) => (
                    <TableRow key={subscription.id}>
                      <TableCell className="font-medium">{subscription.tenant}</TableCell>
                      <TableCell>{subscription.plan}</TableCell>
                      <TableCell>{subscription.price}</TableCell>
                      <TableCell>{subscription.users}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(subscription.status)}`}>
                          {subscription.status}
                        </span>
                      </TableCell>
                      <TableCell>{subscription.nextBilling}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleBillingAction("View Details", subscription.tenant)}>
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleBillingAction("Change Plan", subscription.tenant)}>
                              Change Plan
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleBillingAction("Update Billing", subscription.tenant)}>
                              Update Billing
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleBillingAction("Cancel Subscription", subscription.tenant)}>
                              Cancel Subscription
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
        </TabsContent>

        <TabsContent value="billing" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Billing History</CardTitle>
                  <CardDescription>View all billing transactions and payment history</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => handleBillingAction("Export", "billing history")}>
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                  <Input
                    placeholder="Search transactions..."
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
                    <TableHead>Invoice ID</TableHead>
                    <TableHead>Tenant</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBilling.map((bill) => (
                    <TableRow key={bill.id}>
                      <TableCell className="font-medium">{bill.invoiceId}</TableCell>
                      <TableCell>{bill.tenant}</TableCell>
                      <TableCell>{bill.amount}</TableCell>
                      <TableCell>{bill.date}</TableCell>
                      <TableCell>{bill.method}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(bill.status)}`}>
                          {bill.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleBillingAction("View Invoice", bill.invoiceId)}>
                              View Invoice
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleBillingAction("Download", bill.invoiceId)}>
                              Download PDF
                            </DropdownMenuItem>
                            {bill.status === "Failed" && (
                              <DropdownMenuItem onClick={() => handleBillingAction("Retry Payment", bill.invoiceId)}>
                                Retry Payment
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plans" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Plans</CardTitle>
              <CardDescription>Configure pricing plans and features</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                {plans.map((plan, index) => (
                  <Card key={index} className="relative">
                    <CardHeader>
                      <CardTitle className="text-lg">{plan.name}</CardTitle>
                      <div className="text-2xl font-bold">
                        {plan.price}
                        <span className="text-sm font-normal text-muted-foreground">/{plan.period}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <ul className="space-y-2 text-sm">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <div className="pt-4 border-t">
                        <Button variant="outline" className="w-full" onClick={() => handleBillingAction("Edit Plan", plan.name)}>
                          Edit Plan
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BillingSubscriptionPage;
