
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/sonner";
import { CreditCard, Download, Eye, DollarSign, TrendingUp } from "lucide-react";

const payslips = [
  { 
    id: 1, 
    period: "January 2024", 
    payDate: "2024-01-31", 
    grossPay: 5000, 
    netPay: 3750, 
    deductions: 1250,
    status: "Paid"
  },
  { 
    id: 2, 
    period: "December 2023", 
    payDate: "2023-12-31", 
    grossPay: 5000, 
    netPay: 3750, 
    deductions: 1250,
    status: "Paid"
  },
  { 
    id: 3, 
    period: "November 2023", 
    payDate: "2023-11-30", 
    grossPay: 5000, 
    netPay: 3750, 
    deductions: 1250,
    status: "Paid"
  },
];

const currentPayslip = {
  period: "January 2024",
  grossPay: 5000,
  netPay: 3750,
  basicSalary: 4000,
  allowances: 1000,
  taxDeduction: 750,
  insurance: 300,
  retirement: 200,
};

export default function PayslipsPage() {
  const [selectedPayslip, setSelectedPayslip] = useState(null);

  const handleDownload = (period: string) => {
    toast.success(`Downloading payslip for ${period}`);
  };

  const handleView = (payslip: any) => {
    setSelectedPayslip(payslip);
    toast.info(`Viewing payslip for ${payslip.period}`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Paid":
        return <Badge variant="default" className="bg-green-100 text-green-800">Paid</Badge>;
      case "Pending":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "Processing":
        return <Badge variant="outline">Processing</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const ytdGross = payslips.reduce((sum, p) => sum + p.grossPay, 0);
  const ytdNet = payslips.reduce((sum, p) => sum + p.netPay, 0);
  const ytdDeductions = payslips.reduce((sum, p) => sum + p.deductions, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Payslips</h2>
        <p className="text-muted-foreground">View and download your salary statements</p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Month</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(currentPayslip.netPay)}</div>
            <p className="text-xs text-muted-foreground">Net pay for {currentPayslip.period}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">YTD Gross</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(ytdGross)}</div>
            <p className="text-xs text-muted-foreground">Year to date gross</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">YTD Net</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(ytdNet)}</div>
            <p className="text-xs text-muted-foreground">Year to date net</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">YTD Deductions</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(ytdDeductions)}</div>
            <p className="text-xs text-muted-foreground">Year to date deductions</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Payslip History</CardTitle>
            <CardDescription>Your salary statements and payment history</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Period</TableHead>
                  <TableHead>Pay Date</TableHead>
                  <TableHead>Gross Pay</TableHead>
                  <TableHead>Net Pay</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payslips.map((payslip) => (
                  <TableRow key={payslip.id}>
                    <TableCell className="font-medium">{payslip.period}</TableCell>
                    <TableCell>{new Date(payslip.payDate).toLocaleDateString()}</TableCell>
                    <TableCell>{formatCurrency(payslip.grossPay)}</TableCell>
                    <TableCell>{formatCurrency(payslip.netPay)}</TableCell>
                    <TableCell>{getStatusBadge(payslip.status)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleView(payslip)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownload(payslip.period)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Latest Payslip Breakdown</CardTitle>
            <CardDescription>{currentPayslip.period} breakdown</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-green-700">Earnings</h4>
              <div className="flex justify-between text-sm">
                <span>Basic Salary:</span>
                <span>{formatCurrency(currentPayslip.basicSalary)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Allowances:</span>
                <span>{formatCurrency(currentPayslip.allowances)}</span>
              </div>
              <div className="flex justify-between font-medium border-t pt-2">
                <span>Gross Pay:</span>
                <span>{formatCurrency(currentPayslip.grossPay)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-red-700">Deductions</h4>
              <div className="flex justify-between text-sm">
                <span>Tax:</span>
                <span>-{formatCurrency(currentPayslip.taxDeduction)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Insurance:</span>
                <span>-{formatCurrency(currentPayslip.insurance)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Retirement:</span>
                <span>-{formatCurrency(currentPayslip.retirement)}</span>
              </div>
            </div>

            <div className="flex justify-between font-bold text-lg border-t pt-4">
              <span>Net Pay:</span>
              <span className="text-green-600">{formatCurrency(currentPayslip.netPay)}</span>
            </div>

            <Button className="w-full" onClick={() => handleDownload(currentPayslip.period)}>
              <Download className="h-4 w-4 mr-2" />
              Download Current Payslip
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
