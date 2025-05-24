
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { DollarSign, Calculator, FileText, Settings, CheckCircle, AlertCircle, Clock } from "lucide-react";

const mockPayrollData = [
  {
    id: "pay-001",
    employee: "Alice Johnson",
    baseSalary: 75000,
    overtime: 1250,
    bonus: 0,
    deductions: 1500,
    netPay: 6208.33,
    status: "Processed",
    payPeriod: "January 2024"
  },
  {
    id: "pay-002", 
    employee: "Bob Smith",
    baseSalary: 68000,
    overtime: 850,
    bonus: 1000,
    deductions: 1360,
    netPay: 5907.50,
    status: "Pending",
    payPeriod: "January 2024"
  },
  {
    id: "pay-003",
    employee: "Carol White",
    baseSalary: 82000,
    overtime: 0,
    bonus: 2000,
    deductions: 1640,
    netPay: 7026.67,
    status: "Approved",
    payPeriod: "January 2024"
  },
  {
    id: "pay-004",
    employee: "Dave Miller",
    baseSalary: 58000,
    overtime: 600,
    bonus: 500,
    deductions: 1160,
    netPay: 4973.33,
    status: "Pending",
    payPeriod: "January 2024"
  }
];

const mockSalaryStructures = [
  { component: "Base Salary", type: "Fixed", percentage: 70, description: "Monthly fixed salary" },
  { component: "House Rent Allowance", type: "Allowance", percentage: 15, description: "Housing allowance" },
  { component: "Medical Allowance", type: "Allowance", percentage: 5, description: "Medical expenses" },
  { component: "Provident Fund", type: "Deduction", percentage: 12, description: "Retirement savings" },
  { component: "Income Tax", type: "Deduction", percentage: 8, description: "Tax deduction" }
];

const mockBenefits = [
  { name: "Health Insurance", amount: 500, type: "Company Paid" },
  { name: "Life Insurance", amount: 100, type: "Company Paid" },
  { name: "Meal Vouchers", amount: 200, type: "Taxable Benefit" },
  { name: "Transportation", amount: 150, type: "Reimbursement" }
];

export default function PayrollProcessingPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("January 2024");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Processed":
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Processed</Badge>;
      case "Approved":
        return <Badge className="bg-blue-100 text-blue-800"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>;
      case "Pending":
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const totalPayroll = mockPayrollData.reduce((sum, emp) => sum + emp.netPay, 0);
  const pendingPayroll = mockPayrollData.filter(emp => emp.status === "Pending").length;
  const processedPayroll = mockPayrollData.filter(emp => emp.status === "Processed").length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Payroll Processing</h2>
        <p className="text-muted-foreground">Manage salary calculations, deductions, and payroll approvals</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payroll</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalPayroll.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingPayroll}</div>
            <p className="text-xs text-muted-foreground">Require approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{processedPayroll}</div>
            <p className="text-xs text-muted-foreground">Completed payments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Run</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28th</div>
            <p className="text-xs text-muted-foreground">February 2024</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="payroll" className="space-y-4">
        <TabsList>
          <TabsTrigger value="payroll">Current Payroll</TabsTrigger>
          <TabsTrigger value="structure">Salary Structure</TabsTrigger>
          <TabsTrigger value="benefits">Benefits & Deductions</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="payroll" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payroll for {selectedPeriod}</CardTitle>
              <CardDescription>Review and process employee salaries</CardDescription>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="period">Pay Period:</Label>
                  <Input
                    id="period"
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="w-40"
                  />
                </div>
                <Button onClick={() => toast.info("Calculating payroll...")}>
                  <Calculator className="h-4 w-4 mr-2" />
                  Calculate Payroll
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => toast.info("Processing payroll...")}
                >
                  Process All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Base Salary</TableHead>
                    <TableHead>Overtime</TableHead>
                    <TableHead>Bonus</TableHead>
                    <TableHead>Deductions</TableHead>
                    <TableHead>Net Pay</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockPayrollData.map((payroll) => (
                    <TableRow key={payroll.id}>
                      <TableCell className="font-medium">{payroll.employee}</TableCell>
                      <TableCell>${payroll.baseSalary.toLocaleString()}</TableCell>
                      <TableCell>${payroll.overtime}</TableCell>
                      <TableCell>${payroll.bonus}</TableCell>
                      <TableCell>${payroll.deductions}</TableCell>
                      <TableCell className="font-semibold">${payroll.netPay.toLocaleString()}</TableCell>
                      <TableCell>{getStatusBadge(payroll.status)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          {payroll.status === "Pending" && (
                            <Button
                              size="sm"
                              onClick={() => toast.success(`Approved payroll for ${payroll.employee}`)}
                            >
                              Approve
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toast.info(`Viewing payslip for ${payroll.employee}`)}
                          >
                            View
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="structure" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Salary Structure Configuration</CardTitle>
              <CardDescription>Define salary components and calculations</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Component</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Percentage/Amount</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockSalaryStructures.map((structure, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{structure.component}</TableCell>
                      <TableCell>
                        <Badge variant={structure.type === "Deduction" ? "destructive" : "default"}>
                          {structure.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{structure.percentage}%</TableCell>
                      <TableCell>{structure.description}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toast.info("Edit component functionality not implemented yet")}
                        >
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="benefits" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Benefits & Deductions</CardTitle>
              <CardDescription>Manage employee benefits and deduction policies</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Benefit/Deduction</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockBenefits.map((benefit, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{benefit.name}</TableCell>
                      <TableCell>${benefit.amount}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{benefit.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toast.info("Edit benefit functionality not implemented yet")}
                        >
                          Configure
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Payroll Summary</CardTitle>
                <CardDescription>Key metrics for {selectedPeriod}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Total Gross Pay</span>
                  <span className="font-semibold">${(totalPayroll * 1.3).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Deductions</span>
                  <span className="font-semibold">${(totalPayroll * 0.3).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Net Pay</span>
                  <span className="font-semibold">${totalPayroll.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Average Salary</span>
                  <span className="font-semibold">${(totalPayroll / mockPayrollData.length).toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Export Reports</CardTitle>
                <CardDescription>Generate payroll reports and statements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  className="w-full"
                  onClick={() => toast.info("Payroll register export not implemented yet")}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Export Payroll Register
                </Button>
                <Button 
                  variant="outline"
                  className="w-full"
                  onClick={() => toast.info("Tax report export not implemented yet")}
                >
                  Export Tax Reports
                </Button>
                <Button 
                  variant="outline"
                  className="w-full"
                  onClick={() => toast.info("Bank transfer file not implemented yet")}
                >
                  Generate Bank Transfer File
                </Button>
                <Button 
                  variant="outline"
                  className="w-full"
                  onClick={() => toast.info("Payslips generation not implemented yet")}
                >
                  Generate All Payslips
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
